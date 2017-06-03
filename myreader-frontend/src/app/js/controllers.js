require('./shared/component/button-group/button-group.component');
require('./shared/component/button/button.component');
require('./shared/component/notification-panel/notification-panel.component');
require('./shared/component/search-input/search-input.component');
require('./shared/component/autocomplete-input/autocomplete-input.component');
require('./shared/safe-opener/safe-opener.directive');
require('./navigation/subscription-item/subscription-item.component');
require('./entry/entry.component');
require('./shared/timeago/timeago.filter');
require('./subscription/subscription-exclusion/subscription-exclusion.component');

require('angular').module('common.controllers', ['common.services', 'ngMaterial'])

.controller('SubscriptionNavigationCtrl', ['$rootScope', '$scope', '$state', '$http', '$mdSidenav',
function($rootScope, $scope, $state, $http, $mdSidenav) {
    $scope.data = {
        tags: [],
        items: []
    };

    var currentState;
    $scope.currentSelected = $state.params;

    $scope.$on('navigation-change', function(ev, param) {
        currentState = param.state;
        if(param.data) {
            $scope.data = param.data;
        }
    });

    $scope.navigateTo = function (state) {
        $scope.closeSidenav();
        $state.go(state);
    };

    $scope.onSelect = function (selected) {
        $scope.currentSelected = selected;
        $scope.closeSidenav();
        $state.go(currentState, {tag: selected.tag, uuid: selected.uuid});
    };

    $scope.openMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.closeSidenav = function () {
        $mdSidenav('left').close();
    };

    $scope.logout = function() {
        $http({
            method: 'POST',
            url: 'logout'
        })
        .success(function() {
            $rootScope.$emit('refresh');

            $scope.data = {
                tags: [],
                items: []
            };

            $state.go('login');
        })
        .error(function() {
            $scope.message = { type: 'error', message: 'Could not log out'};
        });
    };
}])

.controller('SubscriptionEntryListCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'subscriptionEntryService', 'subscriptionsTagService', 'settingsService', 'hotkeys',
    function($rootScope, $scope, $stateParams, $state, subscriptionEntryService, subscriptionsTagService, settingsService, hotkeys) {

    $scope.data = {entries: []};
    $scope.param = $stateParams;
    $scope.search = "";
    $scope.isOpen = true;

    var onSearch = function (value) {
        $scope.search = value;
        $scope.data = {entries: []};
        $scope.refresh($scope.params());
    };

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
        var focused, idx;
        for(var i=0;i<$scope.data.entries.length;i++) {
            var entry = $scope.data.entries[i];
            if(entry.focused) {
                entry.focused = false;
                entry.visible = false;
                var j = i + 1;
                if(j < $scope.data.entries.length) {
                    focused = $scope.data.entries[j];
                    idx = j;
                }
                break;
            }
        }

        if(!focused) {
            focused = $scope.data.entries[0];
            idx = 0;
        }

        if(focused.seen === false) {
            focused.seen = true;
            subscriptionEntryService.save(focused)
                .then(function(updatedEntry) {
                    $scope.data.entries[idx] = updatedEntry;
                    $scope.data.entries[idx].focused = true;
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
                var entries = $scope.data.entries.concat(data.entries);
                $scope.data = new SubscriptionEntries(entries, data.links)
            })
            .catch(function (error) {
                $scope.message = { type: 'error', message: error };
            });
    };

    $scope.visible = function(item) {
        return item.visible !== undefined ? item.visible : true;
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

    $scope.refresh();

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



    $scope.onSearchChange = function (value) {
        onSearch(value);
    };

    $scope.onSearchClear = function () {
        onSearch('');
    };

    $scope.$on('refresh', function() {
        subscriptionsTagService.findAllByUnseen(true)
            .then(function (data) {
                $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data, state: 'app.entries'});
            })
            .catch(function (error) {
                $scope.message = { type: 'error', message: error};
            });
    });

    subscriptionsTagService.findAllByUnseen(true)
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data, state: 'app.entries'});
        })
        .catch(function (error) {
            $scope.message = { type: 'error', message: error};
        });
}])

.controller('BookmarkEntryListCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'subscriptionEntryService', 'bookmarkService', 'settingsService',
    function($rootScope, $scope, $stateParams, $state, subscriptionEntryService, bookmarkService, settingsService) {

    $scope.data = {entries: []};
    $scope.param = $stateParams;
    $scope.search = "";
    $scope.isOpen = true;

    var onSearch = function (value) {
        $scope.search = value;
        $scope.data = {entries: []};
        $scope.refresh($scope.params());
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

    $scope.addTagParam = function(stateParams, param) {
        if(stateParams.tag) {
            param['entryTagEqual'] = stateParams.tag === "all" ? "*" : stateParams.tag;
        } else {
            param['entryTagEqual'] = '*';
        }
    };

    $scope.params = function() {
        var param = {};

        $scope.addTagParam($stateParams, param);
        $scope.addSearchParam(param);

        param['size'] = settingsService.getPageSize();

        return param;
    };

    $scope.refresh = function(param) {
        subscriptionEntryService.findBy(param || $scope.params())
            .then(function(data) {
                var entries = $scope.data.entries.concat(data.entries);
                $scope.data = new SubscriptionEntries(entries, data.links)
            })
            .catch(function (error) {
                $scope.message = { type: 'error', message: error };
            });
    };

    $scope.loadMore = function() {
        $scope.refresh($scope.data.next())
    };

    $scope.onSearchChange = function (value) {
        onSearch(value);
    };

    $scope.onSearchClear = function () {
        onSearch('');
    };

    $scope.refresh();

    bookmarkService.findAll()
        .then(function (data) {
            $rootScope.$broadcast('navigation-change', {selected: $stateParams, data: data, state: 'app.bookmarks'});
        }).catch(function (error) {
            $scope.message = { type: 'error', message: error};
        });
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

    $scope.onSearchChange = function (value) {
        $scope.searchKey = value;
    };

    $scope.onSearchClear = function () {
        $scope.searchKey = '';
    };

    $scope.refresh();
}])

.controller('SubscriptionCtrl', ['$scope', '$state', '$stateParams', 'subscriptionService', 'subscriptionTagService', 'exclusionService',
    function($scope, $state, $stateParams, subscriptionService, subscriptionTagService, exclusionService) {

    var fetchExclusions = function () {
        return exclusionService.find($stateParams.uuid)
            .then(function (data) {
                $scope.exclusions = data;
            })
            .catch(function (error) {
                $scope.message = { type: 'error', message: error };
            });
    };

    $scope.subscription = {};

    if($stateParams.uuid) {
        subscriptionTagService.findAll()
        .then(function(data) {
            $scope.tags = data;
        })
        .then(fetchExclusions)
        .then(function() {
            subscriptionService.find($stateParams.uuid)
            .then(function(data) {
                $scope.subscription = data;
            });
        });
    }

    $scope.onSelectTag = function (value) {
        $scope.subscription.tag = value;
    };

    $scope.onClearTag = function () {
        $scope.subscription.tag = null;
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
        var fieldErrors = error.data.fieldErrors;

        for(var i=0;i<fieldErrors.length;i++) {
            errorMessage += ' "' + fieldErrors[i].field + '" ' + fieldErrors[i].message;
        }

        $scope.message = { type: 'error', message: errorMessage };
    };

    $scope.onDelete = function() {
        return subscriptionService.unsubscribe($scope.subscription);
    };

    $scope.onSuccessDelete = function() {
        $state.go('app.subscriptions');

    };

    $scope.onError = function(error) {
        $scope.message = { type: 'error', message: error };
    };

    $scope.onExclusionAdd = function (value) {
        exclusionService.save($scope.subscription.uuid, value).then(fetchExclusions);
    };

    $scope.onExclusionDelete = function (value) {
        exclusionService.delete($scope.subscription.uuid, value.uuid).then(fetchExclusions);
    }
}])

.controller('AdminCtrl', ['$scope', 'processingService', 'applicationPropertyService', function($scope, processingService, applicationPropertyService) {

    $scope.onRefreshIndex = function() {
        return processingService.rebuildSearchIndex();
    };

    $scope.onSuccessRefreshIndex = function() {
        $scope.message = { type: 'success', message: 'started' };
    };

    $scope.onErrorRefreshIndex = function(data) {
        $scope.message = { type: 'error', message: data };
    };

    applicationPropertyService.getProperties()
    .success(function(properties) {
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
        $state.go('admin.feed-detail', {uuid: feed.uuid});
    };

    $scope.onSearchChange = function (value) {
        $scope.searchKey = value;
    };

    $scope.onSearchClear = function () {
        $scope.searchKey = '';
    };

    $scope.refresh();
}])

.controller('FeedDetailCtrl', ['$scope', '$stateParams', '$state', 'feedService', 'feedFetchErrorService',
    function($scope, $stateParams, $state, feedService, feedFetchErrorService) {

    $scope.feed = {};
    $scope.error = [];

    $scope.refresh = function() {
        feedService.findOne($stateParams.uuid)
            .then(function(data) {
                $scope.feed = data;
            });

        feedFetchErrorService.findAll($stateParams.uuid)
            .then(function (errors) {
                $scope.errors = errors.fetchError;
            })
    };

    $scope.onDelete = function() {
        return feedService.remove($scope.feed);
    };

    $scope.onSuccessDelete = function() {
        $state.go('app.feed');
    };

    $scope.onSave = function() {
        return feedService.save($scope.feed);
    };

    $scope.onSuccessSave = function() {
        $scope.message = { type: 'success', message: 'saved' };
    };

    $scope.onError = function(error) {
        if(error.status === 409) {
            $scope.message = { type: 'error', message: 'abort. Feed has subscriptions' };
        } else {
            $scope.message = { type: 'error', message: error.data };
        }
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
        .then(function(response) {
            if(response.headers('X-MY-AUTHORITIES').indexOf('ROLE_ADMIN') !== -1) {
                $state.go('admin.overview');
            } else {
                $state.go('app.entries', {tag: 'all'});
            }
        }, function () {
            $scope.message = { type: 'error', message: 'username or password wrong' };
        });
    }
}]);

module.exports = 'controllers';
