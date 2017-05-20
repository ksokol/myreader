var angular = require('angular');
var api = require('./api');
var caches = require('./caches');
var models = require('./models');

angular.module('common.services', ['common.api', 'common.caches'])

.service('subscriptionsTagService', ['$rootScope', 'api', function($rootScope, api) {

    var cache = {
        decrementSubscriptionUnseen: function () {},
        incrementSubscriptionUnseen: function () {}
    };

    $rootScope.$on('subscriptionEntry:updateEntries', function(event, subscriptionEntries) {
        if(subscriptionEntries === undefined || subscriptionEntries.length === 0) {
            return;
        }

        for(var i=0;i<subscriptionEntries.length;i++) {
            if(subscriptionEntries[i].seen) {
                cache.decrementSubscriptionUnseen(subscriptionEntries[i].feedUuid);
            } else {
                cache.incrementSubscriptionUnseen(subscriptionEntries[i].feedUuid)
            }
        }
    });

    return {
        findAllByUnseen: function(unseen) {
            var withUnseen = unseen ? '?unseenGreaterThan=0' : '';
            var promise = api.get('subscriptionsTag', '/myreader/api/2/subscriptions' + withUnseen);

            promise.then(function(data) {
                cache = data;
            });

            return promise;
        }
    }
}])

.service('subscriptionEntryService', ['$rootScope', '$q', 'api', 'deferService', function($rootScope, $q, api) {
    var url = '/myreader/api/2/subscriptionEntries?';

    return {
        findBy: function(params) {
            var tmp = url;

            if(angular.isString(params)) {
                tmp = params;
            } else {
                for(var key in params) {
                    if (params.hasOwnProperty(key)) {
                        tmp += "&" + key + "=" + params[key];
                    }
                }
            }

            return api.get('subscriptionEntries', tmp);
        },
        updateEntries: function(entries) {
            var promise =  api.patch('subscriptionEntries', url, entries);

            promise.then(function(data) {
                $rootScope.$broadcast('subscriptionEntry:updateEntries', data.entries);
            });

            return promise;
        },
        save: function(entry) {
            var deferred = $q.defer();

            this.updateEntries([entry])
            .then(function (data) {
                deferred.resolve(data.entries[0]);
            })
            .catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    }
}])

.service('subscriptionService', ['$rootScope', 'api', function($rootScope, api) {
    var url = '/myreader/api/2/subscriptions';

    return {
        findAll: function() {
            return api.get('subscriptions', url);
        },
        find: function(uuid) {
            return api.get('subscription', url + '/' + uuid);
        },
        save: function(subscription) {
            if(subscription.uuid) {
                return api.patch('subscription', url + '/' + subscription.uuid, subscription);
            }
            return api.post('subscription', url, subscription);
        },
        unsubscribe: function(subscription) {
            return api.delete('subscription', url + '/' + subscription.uuid);
        }
    }
}])

.service('exclusionService', ['$rootScope', 'api', function($rootScope, api) {
    var url = '/myreader/api/2/exclusions';

    return {
        find: function(uuid) {
            return api.get('exclusions', url + '/' + uuid + '/pattern');
        },
        save: function(uuid, exclusion) {
            return api.post('exclusion', url + '/' + uuid + '/pattern', exclusion);
        },
        delete: function(subscriptionUuid, uuid) {
            return api.delete('exclusion', url + '/' + subscriptionUuid + '/pattern/' + uuid);
        }
    }
}])

.service('subscriptionTagService', ['api', function(api) {
    var url = '/myreader/api/2/subscriptions/availableTags';

    return {
        findAll: function() {
            return api.get('subscriptionTag', url);
        }
    }
}])

.service('feedService', ['api', 'deferService', function(api, deferService) {
    var feedUrl = '/myreader/api/2/feeds';

    return {
        findAll: function() {
            return api.get('feeds', feedUrl);

        },
        findOne: function(uuid) {
            var fetchErrorFn = function(data) {
                return api.get('fetchError', feedUrl + '/' + uuid + '/fetchError')
                    .then(function(errors) {
                        data.errors = errors.fetchError;
                        return deferService.resolved(data);
                    });
            };

            return api.get('feed', feedUrl + '/' + uuid).then(fetchErrorFn);
        },
        remove: function(feed) {
            return api.delete('feed',feedUrl + '/' + feed.uuid);
        },
        save: function(feed) {
            return api.patch('feed', feedUrl + '/' + feed.uuid, feed);
        }
    }
}])

.service('bookmarkService', ['api', function(api) {
    var url = '/myreader/api/2/subscriptionEntries/availableTags';

    return {
        findAll: function() {
            return api.get('bookmarkTags', url);
        }
    }
}])

.service('deferService', ['$q', function($q) {

    var _deferred = function(fn, params) {
        var deferred = $q.defer();
        fn(params).$promise
            .then(function(result) {
                deferred.resolve(result);
            })
            .catch(function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };

    var _resolved = function(params) {
        var deferred = $q.defer();
        deferred.resolve(params);
        return deferred.promise;
    };

    var _reject = function(params) {
        var deferred = $q.defer();
        deferred.reject(params);
        return deferred.promise;
    };

    return {
        deferred: _deferred,
        resolved: _resolved,
        reject: _reject
    }
}])

.service('permissionService', function() {

    var authorities = [];

    return {
        setAuthorities: function(roles) {
            if(angular.isString(roles)) {
                var splitted = roles.split(',');
                var tmp = [];
                angular.forEach(splitted, function (value) {
                    tmp.push(value);
                });
                authorities = tmp;
            }
        },
        isAdmin: function() {
            for(var i=0;i<authorities.length;i++) {
                if (authorities[i] === "ROLE_ADMIN") {
                    return true;
                }
            }
            return false;
        }
    }
})

.service('processingService', ['api', function(api) {
    var rebuildIndex = '/myreader/api/2/processing';

    return {
        rebuildSearchIndex: function() {
            return api.put('searchIndexJob', rebuildIndex, 'indexSyncJob');
        }
    }
}])

.service('settingsService', ['settingsCache', function(settingsCache) {

    return {
        getPageSize: function() {
            var pageSize = settingsCache.get('settings-pageSize');
            return pageSize || 10;
        },
        setPageSize: function(pageSize) {
            settingsCache.put('settings-pageSize', pageSize);
        },
        isShowEntryDetails: function() {
            var showEntryDetails = settingsCache.get('settings-showEntryDetails');
            return angular.isDefined(showEntryDetails) ? showEntryDetails : true;
        },
        setShowEntryDetails: function(showEntryDetails) {
            settingsCache.put('settings-showEntryDetails', showEntryDetails);
        },
        isShowUnseenEntries: function() {
            var showUnseenEntries = settingsCache.get('settings-showUnseenEntries');
            return angular.isDefined(showUnseenEntries) ? showUnseenEntries : true;
        },
        setShowUnseenEntries: function(showUnseenEntries) {
            settingsCache.put('settings-showUnseenEntries', showUnseenEntries);
        }
    }
}])

.service('applicationPropertyService', ['api', function(api) {
    var url = '/myreader/info';

    return {
        getProperties: function() {
            return api.get('applicationInfo', url);
        }
    }
}]);

module.exports = 'services';
