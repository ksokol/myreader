angular.module('common.caches', ['angular-cache'])

.service('subscriptionsTagCache', ['CacheFactory', function(CacheFactory) {

    return CacheFactory.createCache('subscriptionsTagCache', {
        deleteOnExpire: 'aggressive',
        maxAge: 60 * 5 * 1000 //5 minutes
    });
}])

.service('subscriptionEntryCache', ['CacheFactory', function(CacheFactory) {

    return CacheFactory.createCache('subscriptionEntryCache', {
        deleteOnExpire: 'aggressive'
    });
}])

.service('subscriptionEntriesCache', ['CacheFactory', function(CacheFactory) {

    return CacheFactory.createCache('subscriptionEntriesCache', {
        deleteOnExpire: 'aggressive',
        maxAge: 60 * 5 * 1000 //5 minutes
    });
}])

.service('subscriptionEntryTagCache', ['CacheFactory', function(CacheFactory) {

    return CacheFactory.createCache('subscriptionEntryTagCache', {
        deleteOnExpire: 'aggressive',
        maxAge: 60 * 5 * 1000 //5 minutes
    });
}])

.service('subscriptionTagCache', ['CacheFactory', function(CacheFactory) {

    return CacheFactory.createCache('subscriptionTagCache', {
        deleteOnExpire: 'aggressive',
        maxAge: 60 * 5 * 1000 //5 minutes
    });
}])

.service('feedProbeCache', ['CacheFactory', function(CacheFactory) {

    return CacheFactory.createCache('feedProbeCache');
}])

.service('bookmarksCache', ['CacheFactory', function(CacheFactory) {

    return CacheFactory.createCache('bookmarks', {
        deleteOnExpire: 'aggressive',
        maxAge: 60 * 5 * 1000 //5 minutes
    });
}])

.service('settingsCache', ['CacheFactory', function(CacheFactory) {

    return CacheFactory.createCache('settingsCache', {
        storageMode : 'localStorage'
    });
}]);
