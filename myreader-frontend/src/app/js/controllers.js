import angular from 'angular';

angular.module('common.controllers', [])

/**
 * @deprecated
 */
.controller('SubscriptionNavigationCtrl', ['$scope', '$state', '$mdSidenav', function($scope, $state, $mdSidenav) {

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
}]);
