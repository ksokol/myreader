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
}])
.directive('myEntryTags',['subscriptionEntryService', function(subscriptionEntryService) {
    return {
        restrict: 'E',
        templateUrl: 'Tags',
        scope: {
            entry: '=entry'
        },
        controller: ['$scope', function ($scope) {
            $scope.tags = [];

            var _split = function(tags) {
                var splitted = tags === null ? [] : tags.split(/[ ,]+/);
                var tags = [];
                for(var i=0;i<splitted.length;i++) {
                    if(tags.indexOf(splitted[i]) === -1) {
                        tags.push(splitted[i]);
                    }
                };
                return tags;
            };

            if($scope.entry.tag !== null) {
                $scope.tags = _split($scope.entry.tag);
            }

            $scope.addTag = function($chip) {
                var tmp = angular.copy($scope.tags);
                tmp.push($chip);
                $scope.entry.tag = tmp.join(", ");
                subscriptionEntryService.save($scope.entry)
                .then(function(data) {
                    $scope.tags = _split(data.entries[0].tag)
                });
                return $chip;
            };

            $scope.removeTag = function($chip) {
                var tmp = angular.copy($scope.tags);
                tmp.splice(tmp.indexOf($chip), 1);
                $scope.entry.tag = tmp.length === 0 ? null : tmp.join(", ");
                subscriptionEntryService.save($scope.entry)
                .then(function(data) {
                    $scope.tags = _split(data.entries[0].tag)
                });
            }
        }]
    }
}]);
