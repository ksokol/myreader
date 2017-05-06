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
.directive("myWrapEntryContent", ['$window', '$mdMedia', function($window, $mdMedia) {
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
        template: require('../../templates/tags.html'),
        scope: {
            entry: '=entry'
        },
        controller: ['$scope', function ($scope) {
            $scope.tags = [];

            var _split = function(tags) {
                if(!tags) {
                    return [];
                }

                var splitted = tags.split(/[ ,]+/);
                var tmp = [];
                for(var i=0;i<splitted.length;i++) {
                    if(tmp.indexOf(splitted[i]) === -1) {
                        tmp.push(splitted[i]);
                    }
                }
                return tmp;
            };

            $scope.$watch("entry", function(entry) {
                if(entry.tag !== null) {
                    $scope.tags = _split(entry.tag);
                }
            });

            $scope.addTag = function() {
                var tmp = angular.copy($scope.tags);
                $scope.entry.tag = tmp.join(", ");
                subscriptionEntryService.save($scope.entry)
                .then(function(data) {
                    $scope.tags = _split(data.entries[0].tag)
                });
            };

            $scope.removeTag = function() {
                var tmp = angular.copy($scope.tags);
                $scope.entry.tag = tmp.length === 0 ? null : tmp.join(", ");
                subscriptionEntryService.save($scope.entry)
                .then(function(data) {
                    $scope.tags = _split(data.entries[0].tag)
                });
            }
        }]
    }
}])

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
}])

.directive('myEnterKey', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnterKey);
                });

                event.preventDefault();
            }
        });
    };
})

.directive('myDeleteKey', function () {
    return function (scope, element, attrs) {
        element.bind("keyup keypress", function (event) {
            if(event.which === 8) {
                scope.$apply(function () {
                    scope.$eval(attrs.myDeleteKey);
                });
            }
        });
    };
})

.directive('myClickBroadcast', ['$rootScope', function($rootScope) {

    return {
        link : function(scope, element, attrs) {
            element.bind("click", function() {
                var splitted = attrs.myClickBroadcast.split(' ');
                angular.forEach(splitted, function(eventName) {
                    if(eventName.length > 0) {
                        $rootScope.$broadcast(eventName);
                    }
                });
            });
        }
    }
}])

.directive('myShowAdmin', ['permissionService', function(permissionService) {

    return {
        restrict: 'A',
        link : function(scope, element) {
            scope.$watch(function() {
                return permissionService.isAdmin();
            }, function(newVal) {
                if(!newVal) {
                    element.addClass('hide');
                } else {
                    element.removeClass('hide')
                }
            });
        }
    }
}])

.directive('myHideAdmin', ['permissionService', function(permissionService) {

    return {
        restrict: 'A',
        link : function(scope, element) {
            scope.$watch(function() {
                return permissionService.isAdmin();
            }, function(newVal) {
                if(!newVal) {
                    element.removeClass('hide');
                } else {
                    element.addClass('hide')
                }
            });
        }
    }
}]);

module.exports = 'directives';
