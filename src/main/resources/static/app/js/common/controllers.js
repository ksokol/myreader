angular.module('common.controllers', ['common.services'])

.controller('TopBarCtrl', ['$rootScope', '$scope', '$mdSidenav', function($rootScope, $scope, $mdSidenav) {

    $scope.openMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.$on('navigation-close', function() {
        $mdSidenav('left').close();
    });

}])

.controller('TopBarActionsCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {

    $scope.refresh = function() {
        $rootScope.$broadcast('refresh');
    };

    $scope.update = function() {
        $rootScope.$broadcast('update');
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

.controller('SubscriptionEntryListCtrl', ['$scope', '$stateParams', '$state', 'subscriptionEntryService', function($scope, $stateParams, $state, subscriptionEntryService) {

    $scope.data = {entries: []};
    $scope.param = $stateParams;

    var refresh = function(param) {
        subscriptionEntryService.findBy(param)
        .then(function(data) {
            data.entries = $scope.data.entries.concat(data.entries);
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
            subscriptionEntryService.updateEntries(selected)
            .then(function() {
                angular.forEach(selected, function(entry) {
                    entry.visible = false;
                });
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

.controller('SubscriptionEntryCtrl', ['$scope', '$stateParams', '$previousState', '$mdToast', 'subscriptionEntryService', 'subscriptionEntryTagService', function($scope, $stateParams, $previousState, $mdToast, subscriptionEntryService, subscriptionEntryTagService) {

    $scope.entry = {};
    $scope.availableTags = [];

    if($stateParams.uuid) {
        subscriptionEntryService.findOne($stateParams.uuid)
        .then(function(data) {
            $scope.entry = data;
        });
    }

    $scope.save = function() {
        subscriptionEntryService.updateEntries($scope.entry)
        .then(function(data) {
            $scope.entry = data;
            //TODO
            $scope.entry.hidden = true;
            $mdToast.show(
                $mdToast.simple()
                    .content('saved')
                    .position('top right')
                );
        });
    };

    $scope.markAsRead = function() {
        $scope.entry.seen = true;
        subscriptionEntryService.save($scope.entry)
        .then(function(data) {
            $previousState.go();
        });
    };

    $scope.fetchTags = function() {
        subscriptionEntryTagService.findAll()
        .then(function(data) {
            $scope.availableTags = data;
        });
    };

    $scope.back = function() {
        $previousState.go();
    };

}]);
