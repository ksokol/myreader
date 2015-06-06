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

.service('subscriptionEntryService', ['$rootScope', 'api', function($rootScope, api) {
     var url = '/myreader/api/2/subscriptionEntries?';
     var url2 = '/myreader/api/2/subscriptionEntries';

    return {
        findBy: function(params) {
            var tmp = url;
            for(key in params) {
                tmp += "&" + key + "=" + params[key]
            }
            return api.get('subscriptionEntries', tmp);
        },
        updateEntries: function(entries) {
            var promise =  api.patch('subscriptionEntries', url, entries);

            promise.then(function(data) {
                $rootScope.$broadcast('subscriptionEntry:updateEntries', data);
            });

            return promise;
        },
        findOne: function(id) {
            return api.get('subscriptionEntry', url2 + '/' + id);
        },
        save: function(entry) {
            return api.patch('subscriptionEntry', url2 + '/' + entry.uuid, entry);
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
