var angular = require('angular');
var models = require('./models');

angular.module('common.services', [])

.service('subscriptionsTagService', ['$rootScope', '$http', function($rootScope, $http) {

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

            return $http.get('/myreader/api/2/subscriptions' + withUnseen)
                .then(function(response) {
                    cache = new SubscriptionTags(response.data.content);
                    return cache;
                });
        }
    }
}])

.service('subscriptionEntryService', ['$rootScope', '$http', '$q', function($rootScope, $http, $q) {
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

            return $http.get(tmp)
                .then(function (response) {
                    return new SubscriptionEntries(response.data.content, response.data.links);
                });
        },
        updateEntries: function(entries) {
            var converted = [];
            angular.forEach(entries, function(val) {
                if(angular.isString(val.uuid) && val.uuid.length > 0) {
                    var obj = {};
                    obj["uuid"] = val.uuid;

                    if(val.seen === true || val.seen === false) {
                        obj["seen"] = val.seen;
                    }

                    if(angular.isDefined(val.tag)) {
                        obj["tag"] = val.tag;
                    }

                    converted.push(obj);
                }
            });

            return $http.patch(url, {content: converted})
                .then(function (response) {
                    var subscriptionEntries = new SubscriptionEntries(response.data.content, response.data.links);
                    $rootScope.$broadcast('subscriptionEntry:updateEntries', subscriptionEntries.entries);
                    return subscriptionEntries;
                });
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

.service('feedService', ['$http', function($http) {
    var feedUrl = '/myreader/api/2/feeds';

    return {
        findAll: function() {
            return $http.get(feedUrl)
                .then(function (response) {
                    return new Feeds(response.data.content, response.data.links);
                });
        },
        findOne: function(uuid) {
            return $http.get(feedUrl + '/' + uuid)
                .then(function (response) {
                    return response.data;
                });
        },
        remove: function(feed) {
            return $http.delete(feedUrl + '/' + feed.uuid);
        },
        save: function(feed) {
            return $http.patch(feedUrl + '/' + feed.uuid, { 'title': feed.title, 'url': feed.url })
                .then(function (response) {
                    return response.data;
                });
        }
    }
}])

.service('feedFetchErrorService', ['$http', function($http) {
    var feedUrl = '/myreader/api/2/feeds';

    return {
        findAll: function(feedUuid) {
            return $http.get(feedUrl + '/' + feedUuid + '/fetchError')
                .then(function (response) {
                    return new FetchError(response.data.content, response.data.links);
                });
        }
    }
}])

.service('bookmarkService', ['$http', function($http) {
    var url = '/myreader/api/2/subscriptionEntries/availableTags';

    return {
        findAll: function() {
            return $http.get(url)
                .then(function (response) {
                    return new Bookmarks(response.data);
                });
        }
    }
}])

.service('processingService', ['$http', function($http) {
    var url = '/myreader/api/2/processing';

    return {
        rebuildSearchIndex: function() {
            return $http.put(url, { process: 'indexSyncJob' });
        }
    }
}])

.service('applicationPropertyService', ['$http', function($http) {
    var url = '/myreader/info';

    return {
        getProperties: function() {
            return $http.get(url);
        }
    }
}]);

module.exports = 'services';
