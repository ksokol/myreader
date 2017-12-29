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

        const params = {feedTagEqual: null, feedUuidEqual: null};

        if(selected.tag && selected.tag !== 'all') {
            params['feedTagEqual'] = selected.tag
        }
        if (selected.uuid) {
            params['feedUuidEqual'] = selected.uuid
        }

        $state.go('app.entries', params, {inherit: false});
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

    const unsubscribe = $ngRedux.connect(getEntries)($scope);
    $scope.$on('$destroy', () => unsubscribe());

    $scope.down = function() {
        if (this.nextFocusableEntry.seen === false) {
            $ngRedux.dispatch(changeEntry({...this.nextFocusableEntry, seen: true}));
        }
        $ngRedux.dispatch(entryFocusNext());
    };

    $scope.up = function() {
        $ngRedux.dispatch(entryFocusPrevious());
    };

    $scope.refresh = function(params) {
        $state.go('app.entries', params, {notify: false})
            .then(() => $ngRedux.dispatch(fetchEntries({path: SUBSCRIPTION_ENTRIES, query: params})));
    };

    $scope.toggleReadFromEnter = function() {
        $ngRedux.dispatch(changeEntry({...this.entryInFocus, seen: !this.entryInFocus.seen}));
    };

    $scope.refresh($stateParams);

    $scope.forceRefresh = function() {
        $ngRedux.dispatch(entryClear());
        $rootScope.$broadcast('refresh');
        $scope.refresh($stateParams);
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
}]);
