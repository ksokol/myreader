import angular from 'angular';
import {SubscriptionTags} from "./models";
import {
    changeEntry,
    entryClear,
    entryFocusNext,
    entryFocusPrevious,
    fetchEntries,
    fetchSubscriptions,
    getEntries,
    getSubscriptions
} from "store";
import {SUBSCRIPTION_ENTRIES} from "./constants";

angular.module('common.controllers', [])

.controller('SubscriptionNavigationCtrl', ['$scope', '$state', '$mdSidenav', '$ngRedux', function($scope, $state, $mdSidenav, $ngRedux) {
    $scope.data = {
        tags: [],
        items: []
    };

    $scope.currentSelected = $state.params;

    const unsubscribe = $ngRedux.subscribe(() => $scope.data = new SubscriptionTags(getSubscriptions($ngRedux.getState()).subscriptions));

    $scope.$on('$destroy', () => unsubscribe());

    $scope.navigateTo = function (state) {
        $scope.closeSidenav();
        $state.go(state);
    };

    $scope.onSelect = function (selected) {
        $scope.currentSelected = selected;
        $scope.closeSidenav();
        $state.go('app.entries', {tag: selected.tag, uuid: selected.uuid});
    };

    $scope.openMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.closeSidenav = function () {
        $mdSidenav('left').close();
    };

    $scope.trackBy = function(item) {
        return JSON.stringify({uuid: item.item || item.title, unseen: item.unseen});
    }

    const fetchSubscriptionTags = () => $ngRedux.dispatch(fetchSubscriptions())

    $scope.$on('refresh', fetchSubscriptionTags);

    fetchSubscriptionTags();
}])

.controller('SubscriptionEntryListCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'hotkeys', '$ngRedux',
    function($rootScope, $scope, $stateParams, $state, hotkeys, $ngRedux) {

    $scope.param = $stateParams;
    $scope.search = "";

    const unsubscribe = $ngRedux.connect(getEntries)($scope);
    $scope.$on('$destroy', () => unsubscribe());

    var onSearch = function (value) {
        $scope.search = value;
        $scope.refresh();
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
        if (this.nextFocusableEntry.seen === false) {
            $ngRedux.dispatch(changeEntry({...this.nextFocusableEntry, seen: true}));
        }
        $ngRedux.dispatch(entryFocusNext());
    };

    $scope.up = function() {
        $ngRedux.dispatch(entryFocusPrevious());
    };

    $scope.refresh = function() {
        $ngRedux.dispatch(fetchEntries({path: SUBSCRIPTION_ENTRIES, query: $scope.params()}));
    };

    $scope.toggleReadFromEnter = function() {
        $ngRedux.dispatch(changeEntry({...this.entryInFocus, seen: !this.entryInFocus.seen}));
    };

    $scope.refresh();

    $scope.forceRefresh = function() {
        $ngRedux.dispatch(entryClear());
        $scope.search = '';
        $rootScope.$broadcast('refresh');
        $scope.refresh();
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
}])

.controller('SubscriptionsCtrl', ['$scope', '$state', 'subscriptionService', function($scope, $state, subscriptionService) {

    $scope.subscriptions = [];

    $scope.refresh = function() {
        subscriptionService.findAll()
        .then(function(data) {
            $scope.searchKey = '';
            $scope.subscriptions = data;
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
