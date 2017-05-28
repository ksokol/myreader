var angular = require('angular');

angular.module('common.directives', [])
.directive("myLoadingIndicator", function() {
    return {
        restrict : "E",
        template: require('../../templates/loading-indicator.html'),
        replace: true,
        link : function(scope) {
            scope.isDisabled = true;

            scope.$on("loading-started", function() {
                scope.isDisabled = false;
            });
            scope.$on("loading-complete", function() {
                scope.isDisabled = true
            });
        }
    };
})

.directive('myExclusions',['exclusionService', function(exclusionService) {
    return {
        restrict: 'E',
        template: require('../../templates/exclusions.html'),
        scope: {
            subscription: '=subscription'
        },
        controller: ['$scope', function ($scope) {
            $scope.exclusions = [];

            var _fetch = function() {
                if($scope.subscription.uuid) {
                    exclusionService.find($scope.subscription.uuid)
                    .then(function (data) {
                        $scope.exclusions = data;
                    });
                }
            };

            $scope.$watch('subscription', _fetch);

            $scope.removeTag = function($chip) {
                exclusionService.delete($scope.subscription.uuid, $chip.uuid).then(_fetch);
            };

            $scope.transform = function($chip) {
                exclusionService.save($scope.subscription.uuid, $chip).then(_fetch);
                return null;
            }
        }]
    }
}]);

module.exports = 'directives';
