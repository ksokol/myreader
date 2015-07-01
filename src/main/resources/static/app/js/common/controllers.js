angular.module('common.controllers', ['common.services'])

.controller('TopBarActionsCtrl', ['$rootScope', '$scope', '$previousState', '$mdSidenav', '$mdMedia', 'hotkeys', function($rootScope, $scope, $previousState, $mdSidenav, $mdMedia, hotkeys) {

    $scope.searchOpen = false;
    $scope.searchKey = "";

    $scope.openMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.$on('navigation-close', function() {
        $mdSidenav('left').close();
    });

    $scope.broadcast = function(eventName, param) {
        $rootScope.$broadcast(eventName, param);
    };

    $scope.back = function() {
        $previousState.go();
    };

    $scope.isInvisible = function(media) {
        if(media) {
            return $mdMedia(media) || $scope.searchOpen;
        }
        return $scope.searchOpen;
    };

    $scope.openSearch = function() {
        $scope.searchOpen = true;
    };

    $scope.onKey = function() {
        if($scope.searchKey.length === 0) {
            $scope.searchOpen = false;
        }
    };

    hotkeys.bindTo($scope)
    .add({
        combo: 'r',
        callback: function() {
            $scope.broadcast('refresh');
        }
    });
}])

.controller('SubscriptionNavigationCtrl', ['$rootScope', '$scope', '$mdMedia', '$state', 'localStorageService', 'subscriptionsTagService', function($rootScope, $scope, $mdMedia, $state, localStorageService, subscriptionsTagService) {
    $scope.data = {
        tags: [],
        items: []
    };

    var openItem = {tag: null, uuid: null};

    var refresh = function() {
        subscriptionsTagService.findAllByUnseen(true)
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

    $scope.open = function(item) {
        $state.go(item);

        if(!$mdMedia('gt')) {
            $rootScope.$broadcast('navigation-close');
        }
    }
}])

.controller('SubscriptionEntryListCtrl', ['$window', '$scope', '$stateParams', '$state', '$mdMedia', 'subscriptionEntryService', 'hotkeys', function($window, $scope, $stateParams, $state, $mdMedia, subscriptionEntryService, hotkeys) {

    $scope.data = {entries: []};
    $scope.param = $stateParams;
    $scope.search = "";

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
        if($scope.search !== "") {
            if($scope.search.indexOf('*') === -1) {
                param['q'] = $scope.search + '*';
            } else {
                param['q'] = $scope.search;
            }
        }
        //TODO
        param['seenEqual'] = false;
        param['size'] = 10;

        return param;
    };

    var _update = function() {
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

    var _down = function() {
        var focused;
        for(var i=0;i<$scope.data.entries.length;i++) {
            var entry = $scope.data.entries[i];
            if(entry.focused) {
                entry.focused = false;
                entry.visible = false;
                var j = i + 1;
                if(j < $scope.data.entries.length) {
                    focused = $scope.data.entries[j];
                }
                break;
            }
        }

        if(!focused) {
            focused = $scope.data.entries[0];
        }

        if(focused.seen === false) {
            focused.seen = true;
            subscriptionEntryService.save(focused)
            .then(function() {
                focused.focused = true;
            });
        } else {
            focused.focused = true;
        }
    };

    var _up = function() {
        for(var i=0;i<$scope.data.entries.length;i++) {
            var entry = $scope.data.entries[i];
            if(entry.focused) {
                entry.focused = false;
                entry.visible = true;
                var j = i - 1;
                if(j > -1) {
                    $scope.data.entries[j].focused = true;
                    $scope.data.entries[j].visible = true;
                }
                return;
            }
        }
    };

    $scope.refresh = function() {
        $scope.data = {entries: []};
        refresh(params());
    };

    $scope.visible = function(item) {
        return item.visible !== undefined ? item.visible : true;
    };

    $scope.seenIcon = function(item) {
        return item.seen ? 'visibility_off' : 'visibility_on';
    };

    $scope.markAsReadAndHide = function(entry) {
        if(!$mdMedia('gt-md')) {
            return;
        }
        subscriptionEntryService.save(entry);
    };

    $scope.toggleRead = function(entry) {
        entry.seen = !entry.seen;
        subscriptionEntryService.save(entry);
    };

    $scope.toggleReadFromEnter = function() {
        for(var i=0;i<$scope.data.entries.length;i++) {
            var entry = $scope.data.entries[i];
            if(entry.focused) {
                $scope.toggleRead(entry);
                return;
            }
        }
    };

    $scope.navigateToDetailPage = function(item) {
        $state.go('app.entry', {uuid: item.uuid});
    };

    $scope.loadMore = function() {
        refresh($scope.data.next());
    };

    $scope.openOrigin = function(entry) {
        $window.open(entry.origin, '_blank');
    };

    $scope.$on('search', function(event, param) {
        $scope.search = param;
        $scope.refresh();
    });

    $scope.isFocused = function(item) {
        return item.focused ? 'my-focused' : '';
    };

    $scope.$on('move-down', _down);
    $scope.$on('move-up', _up);
    $scope.$on('refresh', $scope.refresh);
    $scope.$on('update', _update);

    hotkeys.bindTo($scope)
    .add({
        combo: 'down',
        callback: _down
    });

    hotkeys.bindTo($scope)
    .add({
        combo: 'up',
        callback: _up
    });

    hotkeys.bindTo($scope)
    .add({
        combo: 'enter',
        callback: $scope.toggleReadFromEnter
    });

    refresh(params());
}])

.controller('SubscriptionEntryCtrl', ['$window', '$scope', '$stateParams', '$previousState', '$mdToast', 'subscriptionEntryService', 'subscriptionEntryTagService', function($window, $scope, $stateParams, $previousState, $mdToast, subscriptionEntryService, subscriptionEntryTagService) {

    $scope.entry = {};
    $scope.availableTags = [];

    if($stateParams.uuid) {
        subscriptionEntryService.findOne($stateParams.uuid)
        .then(function(data) {
            $scope.entry = data;

            subscriptionEntryTagService.findAll()
            .then(function(data) {
                $scope.availableTags = data;
            });
        });
    }

    $scope.save = function() {
        if($scope.entry.seen) {
            $scope.entry.visible = false;
        }
        subscriptionEntryService.save($scope.entry)
        .then(function() {
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
        subscriptionEntryService.save($scope.entry)
        .then(function() {
            $previousState.go();
        });
    };

    $scope.$on('open', function() {
        $window.open($scope.entry.origin, '_blank');
    });

    $scope.$on('hide', $scope.markAsRead);
    $scope.$on('save', $scope.save);

}])

.controller('SubscriptionsCtrl', ['$scope', '$state', 'subscriptionService', function($scope, $state, subscriptionService) {

    $scope.data.subscriptions = [];

    subscriptionService.findAll()
    .then(function(data) {
        $scope.data.subscriptions = data;
    });

    $scope.open = function(subscription) {
        $state.go('app.subscription', {uuid: subscription.uuid});
    };

    $scope.$on('search', function(event, param) {
        $scope.search = param;
    });

}])

.controller('SubscriptionCtrl', ['$window', '$scope', '$state', '$mdToast', '$mdDialog', '$stateParams', '$previousState', 'subscriptionService', 'subscriptionTagService', function($window, $scope, $state, $mdToast, $mdDialog, $stateParams, $previousState, subscriptionService, subscriptionTagService) {

    $scope.availableTags = [];

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(value) {
            return (value.indexOf(lowercaseQuery) === 0);
        };
    }

    if($stateParams.uuid) {
        subscriptionTagService.findAll()
        .then(function(data) {
            $scope.availableTags = data;
        })
        .then(function() {
            subscriptionService.find($stateParams.uuid)
            .then(function(data) {
                $scope.subscription = data;
            });
        });
    }

    $scope.querySearch = function(query) {
        return query ? $scope.availableTags.filter(createFilterFor(query)) : $scope.availableTags;
    };

    $scope.isEditForm = function() {
        return $state.is('app.subscription');
    };

    $scope.$on('save', function() {
        if(!$scope.subscriptionForm.$valid) {
            $mdToast.show(
                $mdToast.simple()
                    .content('Can not subscribe to feed yet')
                    .position('top right')
            );
            return;
        }

        subscriptionService.save($scope.subscription)
        .then(function(data) {
            $mdToast.show(
                $mdToast.simple()
                    .content('saved')
                    .position('top right')
            );

            if($scope.subscription.uuid) {
                $scope.subscription = data;
            } else {
                $state.go('app.subscription', {uuid: data.uuid});
            }
        });
    });

    $scope.$on('open', function() {
        $window.open($scope.subscription.origin, '_blank');
    });

    $scope.$on('delete', function(ev) {
        var confirm = $mdDialog.confirm()
            .title('Delete subscription?')
            .ariaLabel('Delete subscription dialog')
            .ok('Yes')
            .cancel('No')
            .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {
            subscriptionService.unsubscribe($scope.subscription)
            .then(function() {
                $previousState.go();
            });
        });
    });

}]);
