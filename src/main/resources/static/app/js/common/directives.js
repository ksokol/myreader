angular.module('common.directives', [])

.directive("loadingIndicator", function() {
    return {
        restrict : "EA",
        link : function(scope, element) {
            scope.$on("loading-started", function() {
                element.removeClass("hide");
            });
            scope.$on("loading-complete", function() {
                element.addClass("hide");
            });
        }
    };
})

.directive("loadingIndicator2", function() {

    return {
        restrict : "E",
        link : function(scope, element) {
            scope.$on("loading-started", function() {
                element.find("div").removeClass("hidden");
                element.find("span").text("").addClass("hidden");
            });

            scope.$on("loading-complete", function() {
                element.find("div").addClass("hidden");
            });

            scope.$on("error", function(data, textStatus) {
                element.find("div").addClass("hidden");
                element.find("span").removeClass("hidden").addClass("error").text(textStatus);
            });

            scope.$on("success", function(data, textStatus) {
                element.find("div").addClass("hidden");
                element.find("span").removeClass("hidden").addClass("success").text(textStatus);
            });
        }
    };
})

.directive("wrapEntryContent", ['$window', '$mdMedia', function($window, $mdMedia) {
    return {
        restrict : "A",
        link : function($scope, $element, attrs) {
            $scope.$watch(function() {
                return $window.innerWidth;
            }, function(value) {
                var big = $mdMedia('gt-md');
                var substract = 16;
                //TODO
                if(big) {
                    substract += 350;
                }
                attrs.$set('style', 'max-width: ' + (value - substract) + 'px');
            });
        }
    };
}]);
