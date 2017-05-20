var angular = require('angular');

angular.module('common.caches', ['angular-cache'])

.service('settingsCache', ['CacheFactory', function(CacheFactory) {

    return CacheFactory.createCache('settingsCache', {
        storageMode : 'localStorage'
    });
}]);

module.exports = 'caches';
