(function() {
"use strict";

var BaseEntryCtrl = function() {};

BaseEntryCtrl.prototype.initialize = function($window, $rootScope, $scope, $stateParams, $state, $mdMedia, subscriptionEntryService, settingsService, hotkeys) {
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
            data.entries = $scope.data.entries.concat(data.entries);
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
        $window.open(entry.origin, '_blank');
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

var SubscriptionEntryListCtrl = function($window, $rootScope, $scope, $stateParams, $state, $mdMedia, subscriptionEntryService, subscriptionsTagService, settingsService, hotkeys) {

    BaseEntryCtrl.call(this);
    this.initialize($window, $rootScope, $scope, $stateParams, $state, $mdMedia, subscriptionEntryService, settingsService, hotkeys);

    subscriptionsTagService.findAllByUnseen(true)
    .then(function (data) {
        $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
    });

    $scope.refresh($scope.params());
};

var BookmarkEntryListCtrl = function($window, $rootScope, $scope, $stateParams, $state, $mdMedia, subscriptionEntryService, bookmarkService, settingsService, hotkeys) {

    BaseEntryCtrl.call(this);
    this.initialize($window, $rootScope, $scope, $stateParams, $state, $mdMedia, subscriptionEntryService, settingsService, hotkeys);

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

    bookmarkService.findAll()
    .then(function (data) {
        $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
    });

    $scope.refresh($scope.params());
};


SubscriptionEntryListCtrl.prototype = Object.create(BaseEntryCtrl.prototype);
SubscriptionEntryListCtrl.prototype.constructor = SubscriptionEntryListCtrl;

BookmarkEntryListCtrl.prototype = Object.create(BaseEntryCtrl.prototype);
BookmarkEntryListCtrl.prototype.constructor = BookmarkEntryListCtrl;

angular.module('common.controllers', ['common.services'])

.controller('TopBarActionsCtrl', ['$rootScope', '$scope', '$previousState', '$mdSidenav', '$mdMedia', 'hotkeys', function($rootScope, $scope, $previousState, $mdSidenav, $mdMedia, hotkeys) {

    $scope.searchOpen = false;
    $scope.searchKey = "";

    $scope.openMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.$on('navigation-close', function() {
        if(!$mdMedia('gt')) {
            $mdSidenav('left').close();
        }
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

.controller('SubscriptionNavigationCtrl', ['$rootScope', '$scope', '$mdMedia', '$state', function($rootScope, $scope, $mdMedia, $state) {
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
    }
}])

.controller('SubscriptionEntryListCtrl', ['$window', '$rootScope', '$scope', '$stateParams', '$state', '$mdMedia', 'subscriptionEntryService', 'subscriptionsTagService', 'settingsService', 'hotkeys', SubscriptionEntryListCtrl])

.controller('BookmarkEntryListCtrl', ['$window', '$rootScope', '$scope', '$stateParams', '$state', '$mdMedia', 'subscriptionEntryService', 'bookmarkService', 'settingsService', 'hotkeys', BookmarkEntryListCtrl])

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
        var filtered = $scope.availableTags.filter(createFilterFor(query));
        return filtered.length === 0 ? [query] : filtered;
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

}])

.controller('AdminCtrl', ['$window', '$scope', '$mdToast', 'processingService', function($window, $scope, $mdToast, processingService) {

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
        $window.open(item.origin, '_blank');
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

.controller('SettingsCtrl', ['$scope', '$mdToast', 'settingsService', function($scope, $mdToast, settingsService) {

    $scope.sizes = [10, 20, 30];
    $scope.currentSize = settingsService.getPageSize();
    $scope.showUnseenEntries = settingsService.isShowUnseenEntries();
    $scope.showEntryDetails = settingsService.isShowEntryDetails();


    $scope.$on('save', function() {
        settingsService.setPageSize($scope.currentSize);
        settingsService.setShowUnseenEntries($scope.showUnseenEntries);
        settingsService.setShowEntryDetails($scope.showEntryDetails);

        $mdToast.show(
            $mdToast.simple()
                .content('saved')
                .position('top right')
        );
    });
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
}])

})();
