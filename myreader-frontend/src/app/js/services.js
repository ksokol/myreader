var angular = require('angular');
var api = require('./api');
var models = require('./models');

angular.module('common.services', ['common.api'])

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

.service('subscriptionEntryService', ['$rootScope', '$q', 'api', function($rootScope, $q, api) {
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

.service('feedService', ['api', '$q', function(api, $q) {
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
                        var deferred = $q.defer();
                        deferred.resolve(data);
                        return deferred.promise;
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

.service('bookmarkService', ['$http', '$q', function($http, $q) {
    var url = '/myreader/api/2/subscriptionEntries/availableTags';

    return {
        findAll: function() {
            var deferred = $q.defer();

            $http.get(url)
                .success(function (data) {
                    var subscriptionTags = new Bookmarks;

                    angular.forEach(data, function (value) {
                        subscriptionTags.addTag(value);
                    });

                    deferred.resolve(subscriptionTags);
                })
                .error(function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
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

.service('settingsService', function() {

    return {
        getPageSize: function() {
            var pageSize = parseInt(localStorage.getItem('settings-pageSize'));
            return isNaN(pageSize) ? 10 : pageSize;
        },
        setPageSize: function(pageSize) {
            localStorage.setItem('settings-pageSize', pageSize);
        },
        isShowEntryDetails: function() {
            var showEntryDetails = localStorage.getItem('settings-showEntryDetails');
            return showEntryDetails === 'true';
        },
        setShowEntryDetails: function(showEntryDetails) {
            localStorage.setItem('settings-showEntryDetails', showEntryDetails);
        },
        isShowUnseenEntries: function() {
            var showUnseenEntries = localStorage.getItem('settings-showUnseenEntries');
            return showUnseenEntries === 'true';
        },
        setShowUnseenEntries: function(showUnseenEntries) {
            localStorage.setItem('settings-showUnseenEntries', showUnseenEntries);
        }
    }
})

.service('applicationPropertyService', ['$http', function($http) {
    var url = '/myreader/info';

    return {
        getProperties: function() {
            return $http.get(url);
        }
    }
}]);

module.exports = 'services';
