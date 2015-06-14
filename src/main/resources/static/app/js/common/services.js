angular.module('common.services', ['common.api', 'angular-cache'])

.service('subscriptionTagService', ['$rootScope', 'api', 'deferService', 'CacheFactory', function($rootScope, api, deferService, CacheFactory) {

    var subscriptionTagCache = CacheFactory.createCache('subscriptionTagCache', {
        deleteOnExpire: 'aggressive',
        maxAge: 60 * 5 * 1000 //5 minutes
    });

    $rootScope.$on('subscriptionEntry:updateEntries', function(event, subscriptionEntries) {
        var cachedSubscriptionTags = subscriptionTagCache.get('subscriptionTags');

        if(!cachedSubscriptionTags) {
            return;
        }

        for(var i=0;i<subscriptionEntries.length;i++) {
            //TODO
            cachedSubscriptionTags.decrementSubscriptionUnseen(subscriptionEntries[i].feedUuid);
        }

        subscriptionTagCache.put('subscriptionTags', cachedSubscriptionTags);
    });

    return {
        findAllByUnseen: function(unseen) {
            var cachedSubscriptionTags = subscriptionTagCache.get('subscriptionTags');
            var cachedUnseenFlag = subscriptionTagCache.get('subscriptionTags.unseenFlag');

            if(cachedUnseenFlag === unseen && cachedSubscriptionTags) {
                return deferService.resolved(cachedSubscriptionTags);
            }

            var withUnseen = unseen ? '?unseenGreaterThan=0' : '';
            var promise = api.get('subscriptionTag', '/myreader/api/2/subscriptions' + withUnseen, subscriptionTagCache);

            promise.then(function(data) {
                subscriptionTagCache.put('subscriptionTags', data);
                subscriptionTagCache.put('subscriptionTags.unseenFlag', unseen);
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
}])

.service('loadingIndicatorService', ['$rootScope', function($rootScope) {

    return {
        show: function() {
            $rootScope.$broadcast('loading-started');
        },
        hide: function() {
            $rootScope.$broadcast('loading-complete');
        }
    }

}]);
