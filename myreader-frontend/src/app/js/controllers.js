import angular from 'angular';
import {SubscriptionEntries} from './models';
import {showErrorNotification} from "./store/common/common.actions";
import {unauthorized} from './store/security/index';

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
        var focused, idx;
        for(var i=0;i<$scope.data.entries.length;i++) {
            var entry = $scope.data.entries[i];
            if(entry.focused) {
                entry.focused = false;
                var j = i + 1;
                if(j < $scope.data.entries.length) {
                    focused = $scope.data.entries[j];
                    idx = j;
                }
                break;
            }
        }

        if(!focused) {
            focused = $scope.data.entries[0];
            idx = 0;
        }

        if(focused.seen === false) {
            focused.seen = true;
            subscriptionEntryService.save(focused)
                .then(function(updatedEntry) {
                    $scope.data.entries[idx] = updatedEntry;
                    $scope.data.entries[idx].focused = true;
                })
                .catch(function (error) {
                    $ngRedux.dispatch(showErrorNotification(error));
                });
        } else {
            focused.focused = true;
        }
    };

    $scope.up = function() {
        for(var i=0;i<$scope.data.entries.length;i++) {
            var entry = $scope.data.entries[i];
            if(entry.focused) {
                entry.focused = false;
                var j = i - 1;
                if(j > -1) {
                    $scope.data.entries[j].focused = true;
                }
                return;
            }
        }
    };

    $scope.refresh = function(param) {
        subscriptionEntryService.findBy(param || $scope.params())
            .then(function(data) {
                var entries = $scope.data.entries.concat(data.entries);
                $scope.data = new SubscriptionEntries(entries, data.links)
            })
            .catch(function (error) {
                $ngRedux.dispatch(showErrorNotification(error));
            });
    };

    $scope.toggleRead = function(entry) {
        entry.seen = !entry.seen;
        subscriptionEntryService.save(entry)
        .catch(function (error) {
            $ngRedux.dispatch(showErrorNotification(error));
        });
    };

    $scope.toggleReadFromEnter = function() {
        for(var i=0;i<$scope.data.entries.length;i++) {
            var entry = $scope.data.entries[i];
            if(entry.focused) {
                $scope.toggleRead(entry);
                return;
            }
        }
    };

    $scope.refresh();

    $scope.loadMore = function() {
        $scope.refresh($scope.data.next())
    };

    $scope.isFocused = function(item) {
        return item.focused ? 'my-focused' : '';
    };

    $scope.forceRefresh = function() {
        $scope.data = {entries: []};
        $rootScope.$broadcast('refresh');
        $scope.refresh($scope.params());
    };

    hotkeys.bindTo($scope)
        .add({
            combo: 'down',
            callback: $scope.down
        });

    hotkeys.bindTo($scope)
        .add({
            combo: 'up',
            callback: $scope.up
        });

    hotkeys.bindTo($scope)
        .add({
            combo: 'enter',
            callback: $scope.toggleReadFromEnter
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
                var entries = $scope.data.entries.concat(data.entries);
                $scope.data = new SubscriptionEntries(entries, data.links)
            })
            .catch(function (error) {
                $ngRedux.dispatch(showErrorNotification(error));
            });
    };

    $scope.loadMore = function() {
        $scope.refresh($scope.data.next())
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
