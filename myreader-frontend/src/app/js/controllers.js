import angular from 'angular';
import {showErrorNotification} from './store/common/index';
import {unauthorized} from './store/security/index';
import {getEntries, entryClear, entryFocusNext, entryFocusPrevious} from './store/entry/index';

angular.module('common.controllers', [])

.controller('SubscriptionNavigationCtrl', ['$rootScope', '$scope', '$state', '$http', '$mdSidenav', '$ngRedux',
function($rootScope, $scope, $state, $http, $mdSidenav, $ngRedux) {
    $scope.data = {
        tags: [],
        items: []
    };

    var currentState;
    $scope.currentSelected = $state.params;

    $scope.$on('navigation-change', function(ev, param) {
        currentState = param.state;
        if(param.data) {
            $scope.data = param.data;
        }
    });

    $scope.navigateTo = function (state) {
        $scope.closeSidenav();
        $state.go(state);
    };

    $scope.onSelect = function (selected) {
        $scope.currentSelected = selected;
        $scope.closeSidenav();
        $state.go(currentState, {tag: selected.tag, uuid: selected.uuid});
    };

    $scope.openMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.closeSidenav = function () {
        $mdSidenav('left').close();
    };

    $scope.logout = function() {
        $http({
            method: 'POST',
            url: 'logout'
        })
        .success(function() {
            $rootScope.$emit('refresh');
            $ngRedux.dispatch(unauthorized());
            $scope.data = {
                tags: [],
                items: []
            };
        })
        .error(function() {
            $ngRedux.dispatch(showErrorNotification('Could not log out'));
        });
    };
}])

.controller('SubscriptionEntryListCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'subscriptionEntryService', 'subscriptionsTagService', 'hotkeys', '$ngRedux',
    function($rootScope, $scope, $stateParams, $state, subscriptionEntryService, subscriptionsTagService, hotkeys, $ngRedux) {

    $scope.data = {entries: []};
    $scope.param = $stateParams;
    $scope.search = "";
    $scope.isOpen = true;

    const unsubscribe = $ngRedux.subscribe(() => {
        const state = getEntries($ngRedux.getState);
        $scope.data.links = state.links;
        $scope.entryInFocus = state.entryInFocus;
        $scope.nextFocusableEntry = state.nextFocusableEntry;
    });

    $scope.$on('$destroy', () => unsubscribe());

    var onSearch = function (value) {
        $scope.search = value;
        $scope.data = {entries: []};
        $scope.refresh($scope.params());
    };

    $scope.addUuidParam = function(stateParams, param) {
        if(stateParams.uuid) {
            param['feedUuidEqual'] = stateParams.uuid;
        }
    };

    $scope.addTagParam = function(stateParams, param) {
        if(stateParams.tag && $stateParams.tag !== "all") {
            param['feedTagEqual'] = stateParams.tag;
        }
    };

    $scope.addSearchParam = function(param) {
        if($scope.search !== "") {
            if($scope.search.indexOf('*') === -1) {
                param['q'] = $scope.search + '*';
            } else {
                param['q'] = $scope.search;
            }
        }
    };

    $scope.params = function() {
        var param = {};

        $scope.addUuidParam($stateParams, param);
        $scope.addTagParam($stateParams, param);
        $scope.addSearchParam(param);

        return param;
    };

    $scope.down = function() {
        const entry = $scope.data.entries.find(it => it.uuid === $scope.nextFocusableEntry);
        if (entry && !entry.seen) {
            entry['seen'] = true
            subscriptionEntryService.save(entry)
                .then(function(updatedEntry) {
                    Object.assign(entry, updatedEntry);
                });
        }
        $ngRedux.dispatch(entryFocusNext());
    };

    $scope.up = function() {
        $ngRedux.dispatch(entryFocusPrevious());
    };

    $scope.refresh = function(param) {
        subscriptionEntryService.findBy(param || $scope.params())
            .then(function(data) {
                $scope.data.entries = $scope.data.entries.concat(data || []);
            });
    };

    $scope.toggleRead = function(entry) {
        entry.seen = !entry.seen;
        subscriptionEntryService.save(entry);
    };

    $scope.toggleReadFromEnter = function() {
        const entry = $scope.data.entries.find(it => it.uuid === $scope.entryInFocus);
        if (entry) {
            $scope.toggleRead(entry);
        }
    };

    $scope.refresh();

    $scope.loadMore = function(more) {
        $scope.refresh(more.query);
    };

    $scope.isFocused = function(item) {
        return item.uuid === $scope.entryInFocus ? 'my-focused' : '';
    };

    $scope.forceRefresh = function() {
        $ngRedux.dispatch(entryClear());
        $scope.data = {entries: []};
        $rootScope.$broadcast('refresh');
        $scope.refresh($scope.params());
    };

    hotkeys.bindTo($scope)
        .add({
            combo: 'down',
            callback: event => {
                event.preventDefault();
                $scope.down();
            }
        });

    hotkeys.bindTo($scope)
        .add({
            combo: 'up',
            callback: event => {
                event.preventDefault();
                $scope.up();
            }
        });

    hotkeys.bindTo($scope)
        .add({
            combo: 'enter',
            callback: event => {
                event.preventDefault();
                $scope.toggleReadFromEnter();
            }
        });

    $scope.onSearchChange = function (value) {
        onSearch(value);
    };

    $scope.onSearchClear = function () {
        onSearch('');
    };

    $scope.$on('refresh', function() {
        subscriptionsTagService.findAllByUnseen(true)
            .then(function (data) {
                $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data, state: 'app.entries'});
            });
    });

    subscriptionsTagService.findAllByUnseen(true)
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data, state: 'app.entries'});
        });
}])

.controller('BookmarkEntryListCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'subscriptionEntryService', 'bookmarkService', '$ngRedux',
    function($rootScope, $scope, $stateParams, $state, subscriptionEntryService, bookmarkService, $ngRedux) {

    $scope.data = {entries: []};
    $scope.param = $stateParams;
    $scope.search = "";
    $scope.isOpen = true;

    const unsubscribe = $ngRedux.subscribe(function() {
        $scope.data.links = getEntries($ngRedux.getState).links
    });

    $scope.$on('$destroy', function() {
        unsubscribe();
    });

    var onSearch = function (value) {
        $scope.search = value;
        $scope.data = {entries: []};
        $scope.refresh($scope.params());
    };

    $scope.addSearchParam = function(param) {
        if($scope.search !== "") {
            if($scope.search.indexOf('*') === -1) {
                param['q'] = $scope.search + '*';
            } else {
                param['q'] = $scope.search;
            }
        }
    };

    $scope.addTagParam = function(stateParams, param) {
        if(stateParams.tag) {
            param['entryTagEqual'] = stateParams.tag === "all" ? "*" : stateParams.tag;
        } else {
            param['entryTagEqual'] = '*';
        }
    };

    $scope.params = function() {
        var param = {};

        $scope.addTagParam($stateParams, param);
        $scope.addSearchParam(param);

        param['seenEqual'] = '*';

        return param;
    };

    $scope.refresh = function(param) {
        subscriptionEntryService.findBy(param || $scope.params())
            .then(function(data) {
                $scope.data.entries = $scope.data.entries.concat(data || []);
            });
    };

    $scope.loadMore = function(more) {
        $scope.refresh(more.query)
    };

    $scope.onSearchChange = function (value) {
        onSearch(value);
    };

    $scope.onSearchClear = function () {
        onSearch('');
    };

    $scope.refresh();

    bookmarkService.findAll()
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data, state: 'app.bookmarks'});
        }).catch(function (error) {
            $ngRedux.dispatch(showErrorNotification(error));
        });
}])

.controller('SubscriptionsCtrl', ['$scope', '$state', 'subscriptionService', function($scope, $state, subscriptionService) {

    $scope.data.subscriptions = [];

    $scope.refresh = function() {
        subscriptionService.findAll()
        .then(function(data) {
            $scope.searchKey = null;
            $scope.data = {}; // overlaps with data from SubscriptionEntryCtrl and BookmarkEntryListCtrl
            $scope.data.subscriptions = data;
        });
    };

    $scope.open = function(subscription) {
        $state.go('app.subscription', {uuid: subscription.uuid});
    };

    $scope.onSearchChange = function (value) {
        $scope.searchKey = value;
    };

    $scope.onSearchClear = function () {
        $scope.searchKey = '';
    };

    $scope.refresh();
}]);
