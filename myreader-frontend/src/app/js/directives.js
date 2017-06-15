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
});
