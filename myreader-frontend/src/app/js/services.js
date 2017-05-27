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

.service('subscriptionService', ['$http', function($http) {
    var url = '/myreader/api/2/subscriptions';

    return {
        findAll: function() {
            return $http.get(url)
                .then(function (response) {
                    return response.data.content;
                });
        },
        find: function(uuid) {
            return $http.get(url + '/' + uuid)
                .then(function (response) {
                    return response.data;
                });
        },
        save: function(subscription) {
            subscription.tag = subscription.tag === "" ? null : subscription.tag;

            if(subscription.uuid) {
                return $http.patch(url + '/' + subscription.uuid, subscription)
                    .then(function (response) {
                        return response.data;
                    });
            }

            return $http.post(url, subscription)
                .then(function (response) {
                    return response.data;
                });
        },
        unsubscribe: function(subscription) {
            return $http.delete(url + '/' + subscription.uuid);
        }
    }
}])

.service('exclusionService', ['$http', function($http) {
    var url = '/myreader/api/2/exclusions';

    return {
        find: function(uuid) {
            return $http.get(url + '/' + uuid + '/pattern')
                .then(function (response) {
                    return response.data.content;
                });
        },
        save: function(uuid, exclusion) {
            return $http.post(url + '/' + uuid + '/pattern', { pattern: exclusion })
                .then(function (response) {
                    return response.data.content;
                });
        },
        delete: function(subscriptionUuid, uuid) {
            return $http.delete(url + '/' + subscriptionUuid + '/pattern/' + uuid);
        }
    }
}])

.service('subscriptionTagService', ['$http', function($http) {
    var url = '/myreader/api/2/subscriptions/availableTags';

    return {
        findAll: function() {
            return $http.get(url)
            .then(function (response) {
                return response.data;
            });
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
            return api.get('feed', feedUrl + '/' + uuid);
        },
        remove: function(feed) {
            return api.delete('feed',feedUrl + '/' + feed.uuid);
        },
        save: function(feed) {
            return api.patch('feed', feedUrl + '/' + feed.uuid, feed);
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

.service('processingService', ['$http', function($http) {
    var url = '/myreader/api/2/processing';

    return {
        rebuildSearchIndex: function() {
            return $http.put(url, { process: 'indexSyncJob' });
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
