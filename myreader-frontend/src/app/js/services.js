var angular = require('angular');
var api = require('./api');
var caches = require('./caches');
var models = require('./models');

angular.module('common.services', ['common.api', 'common.caches'])

.service('subscriptionsTagService', ['$rootScope', 'api', 'deferService', 'subscriptionsTagCache', function($rootScope, api, deferService, subscriptionsTagCache) {

    $rootScope.$on('subscriptionEntry:updateEntries', function(event, subscriptionEntries) {
        var cachedSubscriptionsTags = subscriptionsTagCache.get('subscriptionsTags');

        if(!cachedSubscriptionsTags) {
            return;
        }

        if(subscriptionEntries === undefined || subscriptionEntries.length === 0) {
            return;
        }

        for(var i=0;i<subscriptionEntries.length;i++) {
            if(subscriptionEntries[i].seen) {
                cachedSubscriptionsTags.decrementSubscriptionUnseen(subscriptionEntries[i].feedUuid);
            } else {
                cachedSubscriptionsTags.incrementSubscriptionUnseen(subscriptionEntries[i].feedUuid)
            }
        }

        subscriptionsTagCache.put('subscriptionsTags', cachedSubscriptionsTags);
    });

    $rootScope.$on('refresh', function() {
        subscriptionsTagCache.removeAll();
    });

    return {
        findAllByUnseen: function(unseen) {
            var cachedSubscriptionTags = subscriptionsTagCache.get('subscriptionsTags');
            var cachedUnseenFlag = subscriptionsTagCache.get('subscriptionsTags.unseenFlag');

            if(cachedUnseenFlag === unseen && cachedSubscriptionTags) {
                return deferService.resolved(cachedSubscriptionTags);
            }

            var withUnseen = unseen ? '?unseenGreaterThan=0' : '';
            var promise = api.get('subscriptionsTag', '/myreader/api/2/subscriptions' + withUnseen, subscriptionsTagCache);

            promise.then(function(data) {
                subscriptionsTagCache.put('subscriptionsTags', data);
                subscriptionsTagCache.put('subscriptionsTags.unseenFlag', unseen);
            });

            return promise;
        }
    }
}])

.service('subscriptionEntryService', ['$rootScope', 'api', 'deferService', 'subscriptionEntryCache', 'subscriptionEntriesCache', function($rootScope, api, deferService, subscriptionEntryCache, subscriptionEntriesCache) {
    var url = '/myreader/api/2/subscriptionEntries?';
    var url2 = '/myreader/api/2/subscriptionEntries';

    $rootScope.$on('refresh', function() {
        subscriptionEntriesCache.removeAll();
    });

    return {
        findBy: function(params) {
            var tmp = url;
            var cacheKey = url;
            var next = null;

            if(angular.isString(params)) {
                cacheKey = params.replace(/next=([0-9])*/,function(nextParam) {
                    next = nextParam.substring(5);
                    return '';
                });
                tmp = params;
            } else {
                for(var key in params) {
                    if (params.hasOwnProperty(key)) {
                        tmp += "&" + key + "=" + params[key];

                        if(key !== 'next') {
                            cacheKey += "&" + key + "=" + params[key];
                        } else {
                            next = params[key];
                        }
                    }
                }
            }

            cacheKey = cacheKey.replace(/&/g,'');
            var cached = subscriptionEntriesCache.get(cacheKey);

            if(cached !== undefined) {
                if(cached.contains(next)) {
                    return deferService.resolved(cached);
                }
            }

            var promise = api.get('subscriptionEntries', tmp);

            promise.then(function(data) {
                var newCached = cached;
                if(cached) {
                    newCached.merge(data);
                    data.entries = newCached.entries;
                    data.links = newCached.links;
                    data.next = newCached.next;
                } else {
                    newCached = data;
                }

                subscriptionEntriesCache.put(cacheKey, newCached);

                angular.forEach(data.entries, function(item) {
                    subscriptionEntryCache.put(url2 + '/' + item.uuid, item);
                });
            });

            return promise;
        },
        updateEntries: function(entries) {
            var promise =  api.patch('subscriptionEntries', url, entries);

            promise.then(function(data) {
                $rootScope.$broadcast('subscriptionEntry:updateEntries', data.entries);
                angular.forEach(data.entries, function(value) {
                    subscriptionEntryCache.put(url2 + '/' + value.uuid, value);
                });
            });

            return promise;
        },
        findOne: function(id) {
            var url = url2 + '/' + id;
            var cached = subscriptionEntryCache.get(url);
            if(cached) {
                return deferService.resolved(cached);
            }

            return api.get('subscriptionEntry', url);
        },
        save: function(entry) {
            return this.updateEntries([entry]);
        }
    }
}])

.service('subscriptionEntryTagService', ['$rootScope', 'api', 'deferService', 'subscriptionEntryTagCache', function($rootScope, api, deferService, subscriptionEntryTagCache) {
    var url = '/myreader/api/2/subscriptionEntries/availableTags';

    return {
        findAll: function() {
            var cached = subscriptionEntryTagCache.get('subscriptionEntryTags');
            if(cached) {
                return deferService.resolved(cached);
            }

            var promise = api.get('subscriptionEntryTag', url);

            promise.then(function(data) {
                subscriptionEntryTagCache.put('subscriptionEntryTags', data);
            });

            return promise;
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

.service('subscriptionTagService', ['$rootScope', 'api', 'deferService', 'subscriptionTagCache', function($rootScope, api, deferService, subscriptionTagCache) {
    var url = '/myreader/api/2/subscriptions/availableTags';

    return {
        findAll: function() {
            var cached = subscriptionTagCache.get('subscriptionTags');
            if(cached) {
                return deferService.resolved(cached);
            }

            var promise = api.get('subscriptionTag', url);

            promise.then(function(data) {
                subscriptionTagCache.put('subscriptionTags', data);
            });

            return promise;
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
    var url = '/myreader/api/2/processing/feeds';
    var rebuildIndex = '/myreader/api/2/processing';

    return {
        runningFeedFetches: function() {
            return api.get('probeFeeds', url);
        },
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

.service('windowService', ['$window', function($window) {

    return {
        safeOpen: function(url) {
            var otherWindow = $window.open();
            otherWindow.opener = null;
            otherWindow.location = url;
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
