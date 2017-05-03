var angular = require('angular');

var BaseEntryCtrl = function() {};

BaseEntryCtrl.prototype.initialize = function($rootScope, $scope, $stateParams, $state, $mdMedia, subscriptionEntryService, settingsService, windowService, hotkeys) {
    $scope.data = {entries: []};
    $scope.param = $stateParams;
    $scope.search = "";

    $scope.addUuidParam = function(stateParams, param) {
        if(stateParams.uuid) {
            param['feedUuidEqual'] = stateParams.uuid;
        }
    };

    $scope.addTagParam = function(stateParams, param) {
        if(stateParams.tag && $stateParams.tag !== "all") {
            param['feedTagEqual'] = stateParams.tag;
        }
    };

    $scope.addSearchParam = function(param) {
        if($scope.search !== "") {
            if($scope.search.indexOf('*') === -1) {
                param['q'] = $scope.search + '*';
            } else {
                param['q'] = $scope.search;
            }
        }
    };

    $scope.addSeenParam = function(param) {
        if(settingsService.isShowUnseenEntries()) {
            param['seenEqual'] = false;
        }
    };

    $scope.showDetails = function() {
        return settingsService.isShowEntryDetails();
    };

    $scope.params = function() {
        var param = {};

        $scope.addUuidParam($stateParams, param);
        $scope.addTagParam($stateParams, param);
        $scope.addSearchParam(param);
        $scope.addSeenParam(param);

        param['size'] = settingsService.getPageSize();

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

    $scope.refresh = function(param) {
        subscriptionEntryService.findBy(param)
        .then(function(data) {
            $scope.data = data;
        });
    };

    $scope.visible = function(item) {
        return item.visible !== undefined ? item.visible : true;
    };

    $scope.seenIcon = function(item) {
        return item.seen ? 'visibility_on' : 'visibility_off';
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
        $scope.refresh($scope.data.next());
    };

    $scope.openOrigin = function(entry) {
        windowService.safeOpen(entry.origin);
    };

    $scope.$on('search', function(event, param) {
        $scope.search = param;
        $scope.data = {entries: []};
        $scope.refresh($scope.params());
    });

    $scope.isFocused = function(item) {
        return item.focused ? 'my-focused' : '';
    };

    $scope.$on('move-down', _down);
    $scope.$on('move-up', _up);
    $scope.$on('update', _update);

    $scope.$on('refresh', function() {
        $scope.data = {entries: []};
        $scope.refresh($scope.params());
    });

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
};

var SubscriptionEntryListCtrl = function($rootScope, $scope, $stateParams, $state, $mdMedia, subscriptionEntryService, subscriptionsTagService, settingsService, windowService, hotkeys) {

    BaseEntryCtrl.call(this);
    this.initialize($rootScope, $scope, $stateParams, $state, $mdMedia, subscriptionEntryService, settingsService, windowService, hotkeys);

    $scope.$on('navigation-open', function(ev, param) {
        subscriptionsTagService.findAllByUnseen(true)
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: param.selected, data: data});
        });
    });

    $scope.$on('refresh', function() {
        if($mdMedia('gt-md')) {
            subscriptionsTagService.findAllByUnseen(true)
            .then(function (data) {
                $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
            });
        } else {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: {}});
        }
    });

    if($mdMedia('gt-md')) {
        subscriptionsTagService.findAllByUnseen(true)
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
        });
    }

    $scope.refresh($scope.params());
};

var BookmarkEntryListCtrl = function($rootScope, $scope, $stateParams, $state, $mdMedia, subscriptionEntryService, bookmarkService, settingsService, windowService, hotkeys) {

    BaseEntryCtrl.call(this);
    this.initialize($rootScope, $scope, $stateParams, $state, $mdMedia, subscriptionEntryService, settingsService, windowService, hotkeys);

    $scope.$on('navigation-open', function(ev, param) {
        bookmarkService.findAll()
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: param.selected, data: data});
        });
    });

    $scope.$on('refresh', function() {
        if($mdMedia('gt-md')) {
            bookmarkService.findAll()
                .then(function (data) {
                    $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
                });
        } else {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: {}});
        }
    });

    $scope.addTagParam = function(stateParams, param) {
        if(stateParams.tag) {
            param['entryTagEqual'] = stateParams.tag === "all" ? "*" : stateParams.tag;
        } else {
            param['entryTagEqual'] = '*';
        }
    };

    $scope.addSeenParam = function() {
        //don't add param
    };

    if($mdMedia('gt-md')) {
        bookmarkService.findAll()
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
        });
    }

    $scope.refresh($scope.params());
};


SubscriptionEntryListCtrl.prototype = Object.create(BaseEntryCtrl.prototype);
SubscriptionEntryListCtrl.prototype.constructor = SubscriptionEntryListCtrl;

BookmarkEntryListCtrl.prototype = Object.create(BaseEntryCtrl.prototype);
BookmarkEntryListCtrl.prototype.constructor = BookmarkEntryListCtrl;

angular.module('common.controllers', ['common.services', 'ngMaterial'])

.controller('TopBarActionsCtrl', ['$rootScope', '$scope', '$http', '$state', '$previousState', '$mdSidenav', '$mdMedia', '$stateParams', '$mdToast', 'hotkeys',
    function($rootScope, $scope, $http, $state, $previousState, $mdSidenav, $mdMedia, $stateParams, $mdToast, hotkeys) {

    $scope.searchOpen = false;
    $scope.searchKey = "";

    $scope.openMenu = function() {
        $rootScope.$broadcast('navigation-open', {selected: $stateParams});
        $mdSidenav('left').toggle();
    };

    $scope.$on('navigation-close', function() {
        if(!$mdMedia('gt')) {
            $mdSidenav('left').close();
        }
    });

    $scope.$on('error', function(event, message) {
        $mdToast.show(
            $mdToast.simple()
                .content(message)
                .position('top right')
        );
    });

    $scope.$on('logout', function() {
        $http({
            method: 'POST',
            url: 'logout'
        })
        .success(function() {
            $state.go('login');
        })
        .error(function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('Could not log out')
                    .position('top right')
            );
        });
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

.controller('SubscriptionNavigationCtrl', ['$rootScope', '$scope', '$mdMedia', '$state', '$mdDialog', 'applicationPropertyService',
    function($rootScope, $scope, $mdMedia, $state, $mdDialog, applicationPropertyService) {
    $scope.data = {
        tags: [],
        items: []
    };

    var openItem = {tag: null, uuid: null};

    $scope.$on('navigation-change', function(ev, param) {
        if(param.data) {
            $scope.data = param.data;
        }
        openItem = param.selected;
    });

    $scope.$on('navigation-clear-selection', function() {
        openItem = {tag: null, uuid: null};
    });

    $scope.$on('logout', function() {
        $rootScope.$emit('refresh');

        $scope.data = {
            tags: [],
            items: []
        };
    });

    $scope.isItemSelected= function(item) {
        var openedSection = openItem;
        if(openedSection.tag === item.tag) {
            return true;
        } else if(item.subscriptions) {
            if(item.type === 'global') {
                return false;
            }
            for(var i=0;i<item.subscriptions.length;i++) {
                if(item.subscriptions[i].uuid === openedSection.uuid) {
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
        if(openItem.tag === item.tag) {
            return true;
        }
        if(item.subscriptions) {
            for(var i=0;i<item.subscriptions.length;i++) {
                if(item.subscriptions[i].uuid === openItem.uuid) {
                    return true;
                }
            }
        }
    };

    $scope.toggleOpen = function(item) {
        var link = item.links.entries;
        $state.go(link.route, link.param);
    };

    $scope.visible = function(item) {
        if(item.unseen) {
            return item.unseen > 0;
        }
        return true;
    };

    $scope.showApplicationProperties = function(event) {
        applicationPropertyService.getProperties()
        .then(function(properties) {
            $mdDialog.show({
                template: require('../../templates/application-properties.html'),
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    properties: properties
                },
                controller: ['$scope', '$mdDialog', 'properties', function($scope, $mdDialog, properties) {
                    $scope.properties = properties;
                }]
            });
        });
    };
}])

.controller('SubscriptionEntryListCtrl', ['$rootScope', '$scope', '$stateParams', '$state', '$mdMedia', 'subscriptionEntryService', 'subscriptionsTagService', 'settingsService', 'windowService', 'hotkeys', SubscriptionEntryListCtrl])

.controller('BookmarkEntryListCtrl', ['$rootScope', '$scope', '$stateParams', '$state', '$mdMedia', 'subscriptionEntryService', 'bookmarkService', 'settingsService', 'windowService', 'hotkeys', BookmarkEntryListCtrl])

.controller('SubscriptionEntryCtrl', ['$scope', '$stateParams', '$previousState', '$mdToast', 'subscriptionEntryService', 'windowService',
    function($scope, $stateParams, $previousState, $mdToast, subscriptionEntryService, windowService) {

    $scope.entry = {};

    if($stateParams.uuid) {
        subscriptionEntryService.findOne($stateParams.uuid)
        .then(function(data) {
            $scope.entry = data;
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

    $scope.open = function(event) {
        event.preventDefault();
        windowService.safeOpen($scope.entry.origin);
    };

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

.controller('SubscriptionCtrl', ['$scope', '$state', '$mdToast', '$mdDialog', '$stateParams', '$previousState', 'subscriptionService', 'subscriptionTagService', 'windowService',
    function($scope, $state, $mdToast, $mdDialog, $stateParams, $previousState, subscriptionService, subscriptionTagService, windowService) {

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
        var filtered = $scope.availableTags.filter(createFilterFor(query));
        return filtered.length === 0 ? [query] : filtered;
    };

    $scope.setTag = function(tag) {
        $scope.subscription.tag = tag;
    };

    $scope.save = function() {
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
        }, function(error) {
            for(var i=0;i<error.length;i++) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(error[i].message)
                        .position('top right')
                );
            }
        });
    };

    $scope.open = function() {
        windowService.safeOpen($scope.subscription.origin);
    };

    $scope.delete = function() {
        var confirm = $mdDialog.confirm()
            .title('Delete subscription?')
            .ariaLabel('Delete subscription dialog')
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function() {
            subscriptionService.unsubscribe($scope.subscription)
            .then(function() {
                $previousState.go();
            });
        });
    };

}])

.controller('AdminCtrl', ['$scope', '$mdToast', 'processingService', 'windowService', function($scope, $mdToast, processingService, windowService) {

    $scope.data = [];

    $scope.refresh = function() {
        processingService.runningFeedFetches()
        .then(function(data) {
            $scope.data = data;
        });
    };

    $scope.loadMore = function() {
        //TODO
        $scope.refresh($scope.data.next());
    };

    $scope.openOrigin = function(item) {
        windowService.safeOpen(item.origin);
    };

    $scope.$on('refresh', $scope.refresh);

    $scope.$on('build-search-index', function() {
        processingService.rebuildSearchIndex()
        .then(function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('started')
                    .position('top right')
            );
        })
        .catch(function(data) {
            $mdToast.show(
                $mdToast.simple()
                    .content(data)
                    .position('top right')
            );
        })
    });

    $scope.refresh();
}])

.controller('FeedsCtrl', ['$scope', '$mdToast', '$state', 'feedService', function($scope, $mdToast, $state, feedService) {

    $scope.data = [];

    $scope.refresh = function() {
        feedService.findAll()
            .then(function(data) {
                $scope.data = data;
            });
    };

    $scope.open = function(feed) {
        $state.go('app.feed-detail', {uuid: feed.uuid});
    };

    $scope.$on('refresh', $scope.refresh);

    $scope.refresh();
}])

.controller('FeedDetailCtrl', ['$scope', '$mdToast', '$mdDialog', '$state', '$stateParams', '$previousState', 'feedService', 'windowService',
    function($scope, $mdToast, $mdDialog, $state, $stateParams, $previousState, feedService, windowService) {

    $scope.feed = {};

    $scope.refresh = function() {
        feedService.findOne($stateParams.uuid)
            .then(function(data) {
                $scope.feed = data;
            });
    };

    $scope.open = function(feed) {
        $state.go('app.feed-detail', {uuid: feed.uuid});
    };

    $scope.$on('refresh', $scope.refresh);

    $scope.$on('open', function() {
        windowService.safeOpen($scope.feed.url);
    });

    $scope.$on('delete-feed', function() {
        var confirm = $mdDialog.confirm()
            .title('Delete feed?')
            .ariaLabel('Delete feed dialog')
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function() {
            feedService.remove($scope.feed)
            .then(function() {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Feed deleted')
                        .position('top right')
                );
                $previousState.go();
            })
            .catch(function(data) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(data)
                        .position('top right')
                );
            });
        });
    });

    $scope.$on('save', function() {
        feedService.save($scope.feed)
        .then(function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('saved')
                    .position('top right')
            );
        })
        .catch(function(data) {
            $mdToast.show(
                $mdToast.simple()
                    .content(data)
                    .position('top right')
            );
        })
    });

    $scope.refresh();
}])

.controller('SettingsCtrl', ['$scope', '$mdToast', 'settingsService', function($scope, $mdToast, settingsService) {

    $scope.sizes = [10, 20, 30];
    $scope.currentSize = settingsService.getPageSize();
    $scope.showUnseenEntries = settingsService.isShowUnseenEntries();
    $scope.showEntryDetails = settingsService.isShowEntryDetails();


    $scope.save = function() {
        settingsService.setPageSize($scope.currentSize);
        settingsService.setShowUnseenEntries($scope.showUnseenEntries);
        settingsService.setShowEntryDetails($scope.showEntryDetails);

        $mdToast.show(
            $mdToast.simple()
                .content('saved')
                .position('top right')
        );
    };
}])

.controller('LoginCtrl', ['$rootScope', '$scope', '$http', '$mdToast', '$state', function($rootScope, $scope, $http, $mdToast, $state) {

    $scope.form = {};

    $scope.login = function() {
        var rememberMe = "remember-me=";
        if($scope.form.rememberMe === true) {
            rememberMe = rememberMe + "on";
        }

        var encodedString = "username=" + encodeURIComponent($scope.form.username)+ '&password=' + encodeURIComponent($scope.form.password) + "&" + rememberMe;

        $http({
            method: 'POST',
            url: 'check',
            data: encodedString,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function() {
            $state.go('app.entries', {tag: 'all'});
        })
        .error(function() {
            $mdToast.show(
                $mdToast.simple()
                    .content('username or password wrong')
                    .position('top right')
            );
        });
    }
}]);

module.exports = 'controllers';
