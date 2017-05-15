var angular = require('angular');

require('./shared/component/button-group/button-group.component');
require('./shared/component/button/button.component');

var BaseEntryCtrl = function() {};

BaseEntryCtrl.prototype.initialize = function($rootScope, $scope, $stateParams, $state, subscriptionEntryService, settingsService, windowService, hotkeys) {
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

    $scope.down = function() {
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

    $scope.up = function() {
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
        subscriptionEntryService.findBy(param || $scope.params())
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

    $scope.isFocused = function(item) {
        return item.focused ? 'my-focused' : '';
    };

    $scope.forceRefresh = function() {
        $scope.data = {entries: []};
        $rootScope.$broadcast('refresh');
        $scope.refresh($scope.params());
    };

    hotkeys.bindTo($scope)
    .add({
        combo: 'down',
        callback: $scope.down
    });

    hotkeys.bindTo($scope)
    .add({
        combo: 'up',
        callback: $scope.up
    });

    hotkeys.bindTo($scope)
    .add({
        combo: 'enter',
        callback: $scope.toggleReadFromEnter
    });

    $scope.$watch('search', function() {
        $scope.data = {entries: []};
        $scope.refresh($scope.params());
    });

    $scope.isOpen = true;
};

var SubscriptionEntryListCtrl = function($rootScope, $scope, $stateParams, $state, subscriptionEntryService, subscriptionsTagService, settingsService, windowService, hotkeys) {

    BaseEntryCtrl.call(this);
    this.initialize($rootScope, $scope, $stateParams, $state, subscriptionEntryService, settingsService, windowService, hotkeys);

    $scope.$on('navigation-open', function(ev, param) {
        subscriptionsTagService.findAllByUnseen(true)
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: param.selected, data: data});
        });
    });

    $scope.$on('refresh', function() {
        subscriptionsTagService.findAllByUnseen(true)
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
        });
    });

    subscriptionsTagService.findAllByUnseen(true)
    .then(function (data) {
        $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
    });
};

var BookmarkEntryListCtrl = function($rootScope, $scope, $stateParams, $state, subscriptionEntryService, bookmarkService, settingsService, windowService, hotkeys) {

    BaseEntryCtrl.call(this);
    this.initialize($rootScope, $scope, $stateParams, $state, subscriptionEntryService, settingsService, windowService, hotkeys);

    $scope.$on('navigation-open', function(ev, param) {
        bookmarkService.findAll()
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: param.selected, data: data});
        });
    });

    $scope.$on('refresh', function() {
        bookmarkService.findAll()
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
        });
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

    bookmarkService.findAll()
    .then(function (data) {
        $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
    });
};


SubscriptionEntryListCtrl.prototype = Object.create(BaseEntryCtrl.prototype);
SubscriptionEntryListCtrl.prototype.constructor = SubscriptionEntryListCtrl;

BookmarkEntryListCtrl.prototype = Object.create(BaseEntryCtrl.prototype);
BookmarkEntryListCtrl.prototype.constructor = BookmarkEntryListCtrl;

angular.module('common.controllers', ['common.services', 'ngMaterial'])

.controller('SubscriptionNavigationCtrl', ['$rootScope', '$scope', '$state', '$http', '$mdSidenav', '$mdMedia', '$stateParams', '$mdToast',
function($rootScope, $scope, $state, $http, $mdSidenav, $mdMedia, $stateParams, $mdToast) {
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
}])

.controller('SubscriptionEntryListCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'subscriptionEntryService', 'subscriptionsTagService', 'settingsService', 'windowService', 'hotkeys', SubscriptionEntryListCtrl])

.controller('BookmarkEntryListCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'subscriptionEntryService', 'bookmarkService', 'settingsService', 'windowService', 'hotkeys', BookmarkEntryListCtrl])

.controller('SubscriptionEntryCtrl', ['$scope', '$stateParams', '$mdToast', 'subscriptionEntryService', 'windowService',
    function($scope, $stateParams, $mdToast, subscriptionEntryService, windowService) {

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

    $scope.open = function(event) {
        event.preventDefault();
        windowService.safeOpen($scope.entry.origin);
    };

}])

.controller('SubscriptionsCtrl', ['$scope', '$state', 'subscriptionService', function($scope, $state, subscriptionService) {

    $scope.data.subscriptions = [];

    $scope.refresh = function() {
        subscriptionService.findAll()
        .then(function(data) {
            $scope.searchKey = null;
            $scope.data = {}; // overlaps with data from SubscriptionEntryCtrl and BookmarkEntryListCtrl
            $scope.data.subscriptions = data;
        });
    };

    $scope.open = function(subscription) {
        $state.go('app.subscription', {uuid: subscription.uuid});
    };

    $scope.refresh();
}])

.controller('SubscriptionCtrl', ['$scope', '$state', '$mdToast', '$stateParams', '$previousState', 'subscriptionService', 'subscriptionTagService', 'windowService',
    function($scope, $state, $mdToast, $stateParams, $previousState, subscriptionService, subscriptionTagService, windowService) {

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

    $scope.open = function() {
        windowService.safeOpen($scope.subscription.origin);
    };

    $scope.onSave = function() {
        return subscriptionService.save($scope.subscription);
    };

    $scope.onSuccessSave = function(data) {
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
    };

    $scope.onErrorSave = function(error) {
        for(var i=0;i<error.length;i++) {
            $mdToast.show(
                $mdToast.simple()
                    .content(error[i].message)
                    .position('top right')
            );
        }
    };

    $scope.onDelete = function() {
        return subscriptionService.unsubscribe($scope.subscription);
    };

    $scope.onSuccessDelete = function() {
        $previousState.go();
    };

    $scope.onError = function(error) {
        $mdToast.show(
            $mdToast.simple()
                .content(error)
                .position('top right')
        );
    }
}])

.controller('AdminCtrl', ['$scope', '$mdToast', 'processingService', 'applicationPropertyService', function($scope, $mdToast, processingService, applicationPropertyService) {

    $scope.onRefreshIndex = function() {
        processingService.rebuildSearchIndex();
    };

    $scope.onSuccessRefreshIndex = function() {
        $mdToast.show(
            $mdToast.simple()
                .content('started')
                .position('top right')
        );
    };

    $scope.onErrorRefreshIndex = function() {
        $mdToast.show(
            $mdToast.simple()
                .content(data)
                .position('top right')
        );
    };

    applicationPropertyService.getProperties()
    .then(function(properties) {
        $scope.properties = properties;
    });
}])

.controller('FeedsCtrl', ['$scope', '$mdToast', '$state', 'feedService', function($scope, $mdToast, $state, feedService) {

    $scope.data = [];

    $scope.refresh = function() {
        feedService.findAll()
            .then(function(data) {
                $scope.searchKey = null;
                $scope.data = data;
            });
    };

    $scope.open = function(feed) {
        $state.go('app.feed-detail', {uuid: feed.uuid});
    };

    $scope.refresh();
}])

.controller('FeedDetailCtrl', ['$scope', '$mdToast', '$state', '$stateParams', '$previousState', 'feedService', 'windowService',
    function($scope, $mdToast, $state, $stateParams, $previousState, feedService, windowService) {

    $scope.feed = {};

    $scope.refresh = function() {
        feedService.findOne($stateParams.uuid)
            .then(function(data) {
                $scope.feed = data;
            });
    };

    $scope.open = function() {
        windowService.safeOpen($scope.feed.url);
    };

    $scope.onDelete = function() {
        return feedService.remove($scope.feed);
    };

    $scope.onSuccessDelete = function() {
        $previousState.go();
    };

    $scope.onSave = function() {
        return feedService.save($scope.feed);
    };

    $scope.onSuccessSave = function() {
        $mdToast.show(
            $mdToast.simple()
                .content('saved')
                .position('top right')
        );
    };

    $scope.onError = function(error) {
        $mdToast.show(
            $mdToast.simple()
                .content(error)
                .position('top right')
        );
    };

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
