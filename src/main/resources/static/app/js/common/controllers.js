angular.module('common.controllers', ['common.services'])

.controller('TopBarCtrl', ['$rootScope', '$scope', '$mdSidenav', function($rootScope, $scope, $mdSidenav) {

    $scope.openMenu = function() {
        $rootScope.$broadcast('refresh-navigation-lg');
        $mdSidenav('left').toggle();
    };

    $scope.$on('navigation-close', function() {
        $mdSidenav('left').close();
    });

}])

.controller('SubscriptionNavigationCtrl', ['$rootScope', '$scope', '$mdMedia', '$state', 'localStorageService', 'subscriptionTagService', function($rootScope, $scope, $mdMedia, $state, localStorageService, subscriptionTagService) {
    $scope.data = {
        tags: [],
        subscriptions: []
    };

    if($mdMedia('lg')){
        refresh();
    }

    var openItem = {tag: null, uuid: null};

    var refresh = function() {
        subscriptionTagService.findAllByUnseen(true)
            .then(function (data) {
                $scope.data = data;
            });
    };

    $scope.$on('refresh', refresh);

    $scope.$on('$stateChangeSuccess', function(a,b,c) {
        openItem = c.uuid ? c.uuid : c.tag;
    });

    $scope.$on('refresh-navigation', function() {
        $mdMedia('gt-lg') && refresh();
    });

    $scope.$on('refresh-navigation-lg', refresh);

    $scope.$watch(function() {
        return $mdMedia('gt-lg');
    }, function(big) {
        big && refresh();
    });

    $scope.isItemSelected= function(item) {
        var openedSection = openItem;
        if(openedSection === item.uuid) {
            return true;
        } else if(item.subscriptions) {
            if(item.type === 'global') {
                return false;
            }
            for(i=0;i<item.subscriptions.length;i++) {
                if(item.subscriptions[i].uuid === openedSection) {
                    return true;
                }
            }
        }
        return false;
    };

    $scope.isOpen = function(item) {
        if(item.type === 'global') {
            return false;
        }
        if(openItem == item.uuid) {
            return true;
        }
        if(item.subscriptions) {
            for(i=0;i<item.subscriptions.length;i++) {
                if(item.subscriptions[i].uuid === openItem) {
                    return true;
                }
            }
        }
    };

    $scope.toggleOpen = function(item) {
        if(openItem === item) {
            openItem = null;
            $state.go('app.entries-tags', {tag: 'all'});
        } else {
            openItem = item.uuid;
            if(item.type === 'tag' || item.type === 'global') {
                $state.go('app.entries-tags', {tag: item.uuid});
            } else {
                $state.go('app.entries-subscription', {uuid: item.uuid});
            }
        }
        if(!$mdMedia('lg')) {
            $rootScope.$broadcast('navigation-close');
        }
    };
}])

.controller('SubscriptionEntryListCtrl', ['$rootScope', '$scope', '$stateParams', 'subscriptionEntryService', function($rootScope, $scope, $stateParams, subscriptionEntryService) {

    $scope.data = [];
    $scope.param = $stateParams;

    var refresh = function(param) {
        subscriptionEntryService.findBy(param)
        .then(function(data) {
            $scope.data = data;
        })
    };

    var params = function() {
        var param = {};
        if($stateParams.uuid) {
            param['feedUuidEqual'] = $stateParams.uuid;
        }
        if($stateParams.tag && $stateParams.tag !== "all") {
            param['feedTagEqual'] = $stateParams.tag;
        }
        //TODO
        param['seenEqual'] = false;

        return param;
    };

    $scope.markAsRead = function() {
        var selected = [];
        var tmp = [];
        angular.forEach($scope.data, function(entry) {
            if(entry.seen) {
                selected.push(entry);
            } else {
                tmp.push(entry);
            }
        });

        if(selected.length > 0) {
            subscriptionEntryService.updateEntries(selected)
            .then(function() {
                $scope.data = tmp;
                $rootScope.$broadcast('refresh-navigation', $stateParams);
            });
        }
    };

    $scope.$on('refresh', function() {
        refresh(params());
    });

    refresh(params());
}])

.controller('SubscriptionEntryCtrl', ['$rootScope', '$scope', '$stateParams', '$previousState', 'subscriptionEntryService', 'subscriptionTagService', function($rootScope, $scope, $stateParams, $previousState, subscriptionEntryService, subscriptionTagService) {

    $scope.entry = {};
    $scope.availableTags = [];

    if($stateParams.uuid) {
        subscriptionEntryService.findOne($stateParams.uuid)
        .then(function(data) {
            $scope.entry = data.entry;
            $scope.availableTags = data.availableTags;
        });
    }

    $scope.save = function() {
        subscriptionEntryService.save($scope.entry)
        .then(function(data) {
            $scope.entry = data.entry;
            $scope.availableTags = data.availableTags;
            $rootScope.$broadcast('success', "saved");
        });
    };

    $scope.back = function() {
        $previousState.go()
    };

}]);
