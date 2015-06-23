angular.module('common.services', ['common.api', 'angular-cache'])

.service('subscriptionsTagService', ['$rootScope', 'api', 'deferService', 'CacheFactory', function($rootScope, api, deferService, CacheFactory) {

    var subscriptionTagCache = CacheFactory.createCache('subscriptionsTagCache', {
        deleteOnExpire: 'aggressive',
        maxAge: 60 * 5 * 1000 //5 minutes
    });

    $rootScope.$on('subscriptionEntry:updateEntries', function(event, subscriptionEntries) {
        var cachedSubscriptionsTags = subscriptionTagCache.get('subscriptionsTagCache');

        if(!cachedSubscriptionsTags) {
            return;
        }

        for(var i=0;i<subscriptionEntries.length;i++) {
            if(subscriptionEntries[i].seen) {
                cachedSubscriptionsTags.decrementSubscriptionUnseen(subscriptionEntries[i].feedUuid);
            } else {
                cachedSubscriptionsTags.incrementSubscriptionUnseen(subscriptionEntries[i].feedUuid)
            }
        }

        subscriptionTagCache.put('subscriptionsTagCache', cachedSubscriptionsTags);
    });

    return {
        findAllByUnseen: function(unseen) {
            var cachedSubscriptionTags = subscriptionTagCache.get('subscriptionTags');
            var cachedUnseenFlag = subscriptionTagCache.get('subscriptionTags.unseenFlag');

            if(cachedUnseenFlag === unseen && cachedSubscriptionTags) {
                return deferService.resolved(cachedSubscriptionTags);
            }

            var withUnseen = unseen ? '?unseenGreaterThan=0' : '';
            var promise = api.get('subscriptionsTag', '/myreader/api/2/subscriptions' + withUnseen, subscriptionTagCache);

            promise.then(function(data) {
                subscriptionTagCache.put('subscriptionsTags', data);
                subscriptionTagCache.put('subscriptionsTags.unseenFlag', unseen);
            });

            return promise;
        }
    }
}])

.service('subscriptionEntryService', ['$rootScope', 'api', 'deferService', 'CacheFactory', function($rootScope, api, deferService, CacheFactory) {
    var url = '/myreader/api/2/subscriptionEntries?';
    var url2 = '/myreader/api/2/subscriptionEntries';

    var subscriptionEntryCache = CacheFactory.createCache('subscriptionEntryCache', {
        deleteOnExpire: 'aggressive'
    });

    var subscriptionEntriesCache = CacheFactory.createCache('subscriptionEntriesCache', {
        deleteOnExpire: 'aggressive',
        maxAge: 60 * 5 * 1000 //5 minutes
    });

    $rootScope.$on('refresh', function() {
        subscriptionEntriesCache.removeAll();
    });

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

            var cached = subscriptionEntriesCache.get(tmp);
            if(cached) {
                return deferService.resolved(cached);
            }

            var promise = api.get('subscriptionEntries', tmp);

            promise.then(function(data) {
                subscriptionEntriesCache.put(tmp, data);
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
.service('subscriptionEntryTagService', ['$rootScope', 'api', 'deferService', 'CacheFactory', function($rootScope, api, deferService, CacheFactory) {
    var url = '/myreader/api/2/subscriptionEntries/availableTags';

    var subscriptionEntryTagCache = CacheFactory.createCache('subscriptionEntryTagCache', {
        deleteOnExpire: 'aggressive',
        maxAge: 60 * 5 * 1000 //5 minutes
    });

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


.service('subscriptionService', ['$rootScope', 'api', 'deferService', 'CacheFactory', function($rootScope, api, deferService, CacheFactory) {
    var url = '/myreader/api/2/subscriptions';

    return {
        findAll: function() {
            return api.get('subscriptions', url);
        },
        find: function(uuid) {
            return api.get('subscription', url + '/' + uuid);
        },
        save: function(subscription) {
            return api.patch('subscription', url + '/' + subscription.uuid, subscription);
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

.service('subscriptionTagService', ['$rootScope', 'api', 'deferService', 'CacheFactory', function($rootScope, api, deferService, CacheFactory) {
    var url = '/myreader/api/2/subscriptions/availableTags';

    var subscriptionEntryTagCache = CacheFactory.createCache('subscriptionTagCache', {
        deleteOnExpire: 'aggressive',
        maxAge: 60 * 5 * 1000 //5 minutes
    });

    return {
        findAll: function() {
            var cached = subscriptionEntryTagCache.get('subscriptionTags');
            if(cached) {
                return deferService.resolved(cached);
            }

            var promise = api.get('subscriptionTag', url);

            promise.then(function(data) {
                subscriptionEntryTagCache.put('subscriptionTags', data);
            });

            return promise;
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

    return {
        deferred: _deferred,
        resolved: _resolved
    }
}]);
