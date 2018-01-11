import angular from 'angular'
import {adminPermissionSelector, mediaBreakpointIsDesktopSelector} from 'store'

angular.module('common.controllers', [])

/**
 * @deprecated
 */
.controller('SubscriptionNavigationCtrl', ['$scope', '$state', '$mdSidenav', '$ngRedux', function($scope, $state, $mdSidenav, $ngRedux) {

    const mapStateToScope = state => {
        return {
            isAdmin: adminPermissionSelector(state),
            isDesktop: mediaBreakpointIsDesktopSelector(state)
        }
    }

    const unsubscribe = $ngRedux.connect(mapStateToScope)($scope)

    $scope.$on('destroy', unsubscribe)

    $scope.navigateTo = function (state) {
        $scope.closeSidenav()
        $state.go(state)
    }

    $scope.openMenu = function() {
        $mdSidenav('left').toggle()
    }

    $scope.closeSidenav = function () {
        $mdSidenav('left').close()
    }
}])
