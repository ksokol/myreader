import angular from 'angular';
import {SubscriptionTags} from "./models";
import {fetchSubscriptions, getSubscriptions} from "store";

angular.module('common.controllers', [])

.controller('SubscriptionNavigationCtrl', ['$scope', '$state', '$mdSidenav', '$ngRedux', function($scope, $state, $mdSidenav, $ngRedux) {
    $scope.data = {
        tags: [],
        items: []
    };

    const unsubscribe = $ngRedux.subscribe(() => $scope.data = new SubscriptionTags(getSubscriptions($ngRedux.getState()).subscriptions));

    $scope.$on('$destroy', () => unsubscribe());

    $scope.navigateTo = function (state) {
        $scope.closeSidenav();
        $state.go(state);
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

    $ngRedux.dispatch(fetchSubscriptions())
}]);
