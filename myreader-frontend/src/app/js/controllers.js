var angular = require('angular');

require('./shared/component/button-group/button-group.component');
require('./shared/component/button/button.component');
require('./shared/component/notification-panel/notification-panel.component');
require('./shared/directive/safe-opener/safe-opener.directive');

var BaseEntryCtrl = function() {};

BaseEntryCtrl.prototype.initialize = function($rootScope, $scope, $stateParams, $state, subscriptionEntryService, settingsService, hotkeys) {
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
            })
            .catch(function (error) {
                $scope.message = { type: 'error', message: error};
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
        })
        .catch(function (error) {
            $scope.message = { type: 'error', message: error };
        });
    };

    $scope.visible = function(item) {
        return item.visible !== undefined ? item.visible : true;
    };

    $scope.seenIcon = function(item) {
        return item.seen ? 'visibility_on' : 'visibility_off';
    };

    $scope.markAsReadAndHide = function(entry) {
        subscriptionEntryService.save(entry)
        .catch(function (error) {
            $scope.message = { type: 'error', message: error};
        });
    };

    $scope.toggleRead = function(entry) {
        entry.seen = !entry.seen;
        subscriptionEntryService.save(entry)
        .catch(function (error) {
            $scope.message = { type: 'error', message: error};
        });
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
        $scope.refresh($scope.data.next())
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

var SubscriptionEntryListCtrl = function($rootScope, $scope, $stateParams, $state, subscriptionEntryService, subscriptionsTagService, settingsService, hotkeys) {

    BaseEntryCtrl.call(this);
    this.initialize($rootScope, $scope, $stateParams, $state, subscriptionEntryService, settingsService, hotkeys);

    $scope.$on('navigation-open', function(ev, param) {
        subscriptionsTagService.findAllByUnseen(true)
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: param.selected, data: data});
        })
        .catch(function (error) {
            $scope.message = { type: 'error', message: error};
        });
    });

    $scope.$on('refresh', function() {
        subscriptionsTagService.findAllByUnseen(true)
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
        })
        .catch(function (error) {
            $scope.message = { type: 'error', message: error};
        });
    });

    subscriptionsTagService.findAllByUnseen(true)
    .then(function (data) {
        $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
    })
    .catch(function (error) {
        $scope.message = { type: 'error', message: error};
    });
};

var BookmarkEntryListCtrl = function($rootScope, $scope, $stateParams, $state, subscriptionEntryService, bookmarkService, settingsService, hotkeys) {

    BaseEntryCtrl.call(this);
    this.initialize($rootScope, $scope, $stateParams, $state, subscriptionEntryService, settingsService, hotkeys);

    $scope.$on('navigation-open', function(ev, param) {
        bookmarkService.findAll()
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: param.selected, data: data});
        })
        .catch(function (error) {
            $scope.message = { type: 'error', message: error};
        });
    });

    $scope.$on('refresh', function() {
        bookmarkService.findAll()
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data});
        })
        .catch(function (error) {
            $scope.message = { type: 'error', message: error};
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

.controller('SubscriptionNavigationCtrl', ['$rootScope', '$scope', '$state', '$http', '$mdSidenav', '$mdMedia', '$stateParams',
function($rootScope, $scope, $state, $http, $mdSidenav, $mdMedia, $stateParams) {
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

    $scope.logout = function() {
        $http({
            method: 'POST',
            url: 'logout'
        })
        .success(function() {
            $rootScope.$broadcast('logout');
            $state.go('login');
        })
        .error(function() {
            $scope.message = { type: 'error', message: 'Could not log out'};
        });
    };
}])

.controller('SubscriptionEntryListCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'subscriptionEntryService', 'subscriptionsTagService', 'settingsService', 'hotkeys', SubscriptionEntryListCtrl])

.controller('BookmarkEntryListCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'subscriptionEntryService', 'bookmarkService', 'settingsService', 'hotkeys', BookmarkEntryListCtrl])

.controller('SubscriptionEntryCtrl', ['$scope', '$stateParams', 'subscriptionEntryService',
    function($scope, $stateParams, subscriptionEntryService) {

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
        subscriptionEntryService.save($scope.entry);
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

.controller('SubscriptionCtrl', ['$scope', '$state', '$stateParams', '$previousState', 'subscriptionService', 'subscriptionTagService',
    function($scope, $state, $stateParams, $previousState, subscriptionService, subscriptionTagService) {

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

    $scope.onSave = function() {
        return subscriptionService.save($scope.subscription);
    };

    $scope.onSuccessSave = function(data) {
        $scope.message = { type: 'success', message: 'saved' };

        if($scope.subscription.uuid) {
            $scope.subscription = data;
        } else {
            $state.go('app.subscription', {uuid: data.uuid});
        }
    };

    $scope.onErrorSave = function(error) {
        var errorMessage = '';

        for(var i=0;i<error.length;i++) {
            errorMessage += ' "' + error[i].field + '" ' + error[i].message;
        }

        $scope.message = { type: 'error', message: errorMessage };
    };

    $scope.onDelete = function() {
        return subscriptionService.unsubscribe($scope.subscription);
    };

    $scope.onSuccessDelete = function() {
        $previousState.go();
    };

    $scope.onError = function(error) {
        $scope.message = { type: 'error', message: error };
    }
}])

.controller('AdminCtrl', ['$scope', 'processingService', 'applicationPropertyService', function($scope, processingService, applicationPropertyService) {

    $scope.onRefreshIndex = function() {
        return processingService.rebuildSearchIndex();
    };

    $scope.onSuccessRefreshIndex = function() {
        $scope.message = { type: 'success', message: 'started' };
    };

    $scope.onErrorRefreshIndex = function() {
        $scope.message = { type: 'error', message: data };
    };

    applicationPropertyService.getProperties()
    .then(function(properties) {
        $scope.properties = properties;
    });
}])

.controller('FeedsCtrl', ['$scope', '$state', 'feedService', function($scope, $state, feedService) {

    $scope.data = [];

    $scope.refresh = function() {
        feedService.findAll()
        .then(function(data) {
            $scope.searchKey = null;
            $scope.data = data;
        })
        .catch (function(error) {
            $scope.message = { type: 'error', message: error };
        });
    };

    $scope.open = function(feed) {
        $state.go('app.feed-detail', {uuid: feed.uuid});
    };

    $scope.refresh();
}])

.controller('FeedDetailCtrl', ['$scope', '$stateParams', '$previousState', 'feedService',
    function($scope, $stateParams, $previousState, feedService) {

    $scope.feed = {};

    $scope.refresh = function() {
        feedService.findOne($stateParams.uuid)
            .then(function(data) {
                $scope.feed = data;
            });
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
        $scope.message = { type: 'success', message: 'saved' };
    };

    $scope.onError = function(error) {
        $scope.message = { type: 'error', message: error };
    };

    $scope.refresh();
}])

.controller('SettingsCtrl', ['$scope', 'settingsService', function($scope, settingsService) {

    $scope.sizes = [10, 20, 30];
    $scope.currentSize = settingsService.getPageSize();
    $scope.showUnseenEntries = settingsService.isShowUnseenEntries();
    $scope.showEntryDetails = settingsService.isShowEntryDetails();

    $scope.save = function() {
        settingsService.setPageSize($scope.currentSize);
        settingsService.setShowUnseenEntries($scope.showUnseenEntries);
        settingsService.setShowEntryDetails($scope.showEntryDetails);
    };
}])

.controller('LoginCtrl', ['$rootScope', '$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {

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
            $scope.message = { type: 'error', message: 'username or password wrong' };
        });
    }
}]);

module.exports = 'controllers';
