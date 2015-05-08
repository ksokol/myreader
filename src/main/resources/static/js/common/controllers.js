angular.module('common.controllers', ['common.services'])

.controller('subscriptionNavigationCtrl', ['$scope', 'subscriptionTagService', function($scope, subscriptionTagService) {
    $scope.data = {
        tags: [],
        subscriptions: []
    };

    var refresh = function() {
        subscriptionTagService.findAllByUnseen(true)
        .then(function (data) {
            $scope.data = data;
        });
    };

    $scope.refresh = function() {
        refresh();
    };

    refresh();

}]);
