var angular = require('angular');

angular.module('common.caches', ['angular-cache'])

.service('subscriptionsTagCache', ['CacheFactory', function(CacheFactory) {

    return CacheFactory.createCache('subscriptionsTagCache', {
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

.service('settingsCache', ['CacheFactory', function(CacheFactory) {

    return CacheFactory.createCache('settingsCache', {
        storageMode : 'localStorage'
    });
}]);

module.exports = 'caches';
