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
.directive('myEntryTags', function() {
    return {
        restrict: 'E',
        template: require('../../templates/tags.html'),
        scope: {
            entry: '=myItem',
            hide: '=myHide',
            onSelect: '&myOnSelect'
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
                var tags = angular.copy($scope.tags).join(", ");
                $scope.onSelect({ item: { tag: tags }});
            };

            $scope.removeTag = function() {
                var copy = angular.copy($scope.tags);
                var tags = copy.length === 0 ? null : copy.join(", ");
                $scope.onSelect({ item: { tag: tags }});
            }
        }]
    }
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
