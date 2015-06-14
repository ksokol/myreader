angular.module('common.controllers', ['common.services'])

.controller('TopBarCtrl', ['$rootScope', '$scope', '$mdSidenav', function($rootScope, $scope, $mdSidenav) {

    $scope.openMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.$on('navigation-close', function() {
        $mdSidenav('left').close();
    });

}])

.controller('TopBarActionsCtrl', ['$rootScope', '$scope', '$previousState', function($rootScope, $scope, $previousState) {

    $scope.broadcast = function(eventName) {
        $rootScope.$broadcast(eventName);
    };

    $scope.back = function() {
        $previousState.go();
    };

}])

.controller('SubscriptionNavigationCtrl', ['$rootScope', '$scope', '$mdMedia', '$state', 'localStorageService', 'subscriptionTagService', function($rootScope, $scope, $mdMedia, $state, localStorageService, subscriptionTagService) {
    $scope.data = {
        tags: [],
        subscriptions: []
    };

    var openItem = {tag: null, uuid: null};

    var refresh = function() {
        subscriptionTagService.findAllByUnseen(true)
        .then(function (data) {
            $scope.data = data;
        });
    };

    refresh();

    $scope.$on('$stateChangeSuccess', function(a,b,c) {
        //TODO
        if ($state.is('app.entries-tags') || $state.is('app.entries-tag-subscription') || $state.is('app.entries-subscription')) {
            openItem = c.uuid ? c.uuid : c.tag;
        }
    });

    $scope.isItemSelected= function(item) {
        var openedSection = openItem;
        if(openedSection === item.uuid) {
            return true;
        } else if(item.subscriptions) {
            if(item.type === 'global') {
                return false;
            }
            for(var i=0;i<item.subscriptions.length;i++) {
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
            for(var i=0;i<item.subscriptions.length;i++) {
                if(item.subscriptions[i].uuid === openItem) {
                    return true;
                }
            }
        }
    };

    $scope.toggleOpen = function(item) {
        if(openItem === item) {
            openItem = null;
            $state.go('app.entries-tags', {tag: 'all'}, {reload: true});
        } else {
            openItem = item.uuid;
            if(item.type === 'tag' || item.type === 'global') {
                $state.go('app.entries-tags', {tag: item.uuid}, {reload: true});
            } else {
                $state.go('app.entries-subscription', {uuid: item.uuid}, {reload: true});
            }
        }
        if(!$mdMedia('gt')) {
            $rootScope.$broadcast('navigation-close');
        }
    };
}])

.controller('SubscriptionEntryListCtrl', ['$scope', '$stateParams', '$state', 'loadingIndicatorService', 'subscriptionEntryService', function($scope, $stateParams, $state, loadingIndicatorService, subscriptionEntryService) {

    $scope.data = {entries: []};
    $scope.param = $stateParams;

    var refresh = function(param) {
        loadingIndicatorService.show();
        subscriptionEntryService.findBy(param)
        .then(function(data) {
            data.entries = $scope.data.entries.concat(data.entries);
            $scope.data = data;
            loadingIndicatorService.hide();
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

    $scope.refresh = function() {
        $scope.data = {entries: []};
        refresh(params());
    };

    $scope.visible = function(item) {
        return item.visible !== undefined ? item.visible : true;
    };

    $scope.markAsRead = function() {
        var selected = [];
        angular.forEach($scope.data.entries, function(entry) {
            if(entry.seen && (entry.visible === undefined || entry.visible) ) {
                selected.push(entry);
            }
        });

        if(selected.length > 0) {
            loadingIndicatorService.show();
            subscriptionEntryService.updateEntries(selected)
            .then(function() {
                angular.forEach(selected, function(entry) {
                    entry.visible = false;
                });
                loadingIndicatorService.hide();
            });
        }
    };

    $scope.navigateToDetailPage = function(item) {
        $state.go('app.entry', {uuid: item.uuid});
    };

    $scope.loadMore = function() {
        refresh($scope.data.next());
    };

    $scope.$on('refresh', $scope.refresh);

    $scope.$on('update', $scope.markAsRead);

    refresh(params());
}])

.controller('SubscriptionEntryCtrl', ['$window', '$scope', '$stateParams', '$previousState', '$mdToast', 'loadingIndicatorService', 'subscriptionEntryService', 'subscriptionEntryTagService', function($window, $scope, $stateParams, $previousState, $mdToast, loadingIndicatorService, subscriptionEntryService, subscriptionEntryTagService) {

    $scope.entry = {};
    $scope.availableTags = [];

    if($stateParams.uuid) {
        loadingIndicatorService.show();
        subscriptionEntryService.findOne($stateParams.uuid)
        .then(function(data) {
            $scope.entry = data;

            subscriptionEntryTagService.findAll()
            .then(function(data) {
                $scope.availableTags = data;
                    loadingIndicatorService.hide();
            });
        });
    }

    $scope.save = function() {
        if($scope.entry.seen) {
            $scope.entry.visible = false;
        }
        loadingIndicatorService.show();
        subscriptionEntryService.save($scope.entry)
        .then(function() {
            loadingIndicatorService.hide();
            $mdToast.show(
                $mdToast.simple()
                    .content('saved')
                    .position('top right')
                );
        });
    };

    $scope.markAsRead = function() {
        $scope.entry.seen = true;
        $scope.entry.visible = false;
        loadingIndicatorService.show();
        subscriptionEntryService.save($scope.entry)
        .then(function() {
            loadingIndicatorService.hide();
            $previousState.go();
        });
    };

    $scope.$on('open', function() {
        $window.open($scope.entry.origin, '_blank');
    });

    $scope.$on('hide', $scope.markAsRead);
    $scope.$on('save', $scope.save);

}]);
