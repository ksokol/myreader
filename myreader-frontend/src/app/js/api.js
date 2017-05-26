var angular = require('angular');
var models = require('./models');

angular.module('common.api', [])

.service('subscriptionsTagConverter', function () {
    return {
        convertFrom: function (data) {
            var all = new SubscriptionTag;
            all.title = "all";
            all.uuid = "";
            all.tag = "all";
            all.subscriptions = [];
            all.type = 'global';

            var subscriptionTags = new SubscriptionTags;

            angular.forEach(data.content, function (value) {
                if(!value.tag) {
                    subscriptionTags.addSubscription(value);
                } else {
                    subscriptionTags.addTag(value);
                }
            });
            all.unseen = subscriptionTags.unseen;
            subscriptionTags.tags.unshift(all);
            return subscriptionTags;
        },
        convertError: function (error) {
            return error;
        }
    }
})

.service('subscriptionEntriesConverter', function() {
    return {
        convertFrom: function (data) {
            return new SubscriptionEntries(data.content, data.links);
        },
        convertTo: function(data) {
            var converted = [];
            angular.forEach(data, function(val) {
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
            return {content: converted};
        },
        convertError: function(error) {
            return error;
        }
    }
})

.service('subscriptionEntryTagConverter', function() {

    return {
        convertFrom: function (data) {
            return data;
        }
    }
})

.service('subscriptionsConverter', function() {

    return {
        convertFrom: function (data) {
            return data.content;
        }
    }
})

.service('subscriptionConverter', function() {

    return {
        convertFrom: function (data) {
            return data;
        },
        convertTo: function(data) {
            data.tag = data.tag === "" ? null : data.tag;
            return data;
        },
        convertError: function (data) {
            return data.fieldErrors;
        }
    }
})

.service('exclusionsConverter', function() {

    return {
        convertFrom: function (data) {
            return data.content;
        }
    }
})

.service('exclusionConverter', function() {

    return {
        convertFrom: function(data) {
            return data;
        },
        convertTo: function (data) {
            return { pattern: data };
        }
    }
})

.service('subscriptionTagConverter', function() {

    return {
        convertFrom: function (data) {
            return data;
        }
    }
})
.service('feedsConverter', function() {

    var Feeds = function(feeds, links) {
        var self = this;
        self.feeds = angular.isArray(feeds) ? feeds : [];
        self.links = angular.isArray(links) ? links : [];

        var getLink = function(rel) {
            for(var i=0;i<links.length;i++) {
                if(links[i].rel === rel) {
                    return links[i].href;
                }
            }
        };

        self.next = function() {
            return getLink('next');
        };
    };

    return {
        convertFrom: function (data) {
            return new Feeds(data.content, data.links);
        },
        convertError: function(error) {
            return error;
        }
    }
})
.service('feedConverter', function() {

    return {
        convertFrom: function (data) {
            return data;
        },
        convertTo: function(data) {
            return { 'title': data.title, 'url': data.url };
        },
        convertError: function (data, statusCode) {
            return statusCode === 409 ? 'abort. Feed has subscriptions' : data && data.message ? data.message : "undefined error occurred";
        }
    }
})
.service('fetchErrorConverter', function() {

    var FetchError = function(fetchError, links) {
        var self = this;
        self.fetchError = angular.isArray(fetchError) ? fetchError : [];
        self.links = angular.isArray(links) ? links : [];

        var getLink = function(rel) {
            for(var i=0;i<links.length;i++) {
                if(links[i].rel === rel) {
                    return links[i].href;
                }
            }
        };

        self.next = function() {
            return getLink('next');
        };
    };

    return {
        convertFrom: function (data) {
            return new FetchError(data.content, data.links);
        }
    }
})
.service('searchIndexJobConverter', function() {

    return {
        convertFrom: function() {
            return {};
        },
        convertTo: function (data) {
            return {process: data};
        },
        convertError: function (data) {
            return data;
        }
    }
})
.service('conversionService', ['$injector', function ($injector) {
    return {
        convertFrom: function (resourceType, data) {
            return $injector.get(resourceType + "Converter").convertFrom(data);
        },
        convertTo: function (resourceType, data) {
            return $injector.get(resourceType + "Converter").convertTo(data);
        },
        convertError: function (resourceType, data, statusCode) {
            return $injector.get(resourceType + "Converter").convertError(data, statusCode);
        }
    }
}])

.service('api', ['$http', '$q', 'conversionService', function ($http, $q, conversionService) {
    return {
        get: function (resourceType, url) {
            var deferred = $q.defer();
            $http.get(url)
            .success(function (data) {
                deferred.resolve(conversionService.convertFrom(resourceType, data));
            })
            .error(function(error, statusCode) {
                deferred.reject(conversionService.convertError(resourceType, error, statusCode));
            });
            return deferred.promise;
        },
        patch: function(resourceType, url, data) {
            var converted = conversionService.convertTo(resourceType, data);
            var deferred = $q.defer();
            $http.patch(url, converted)
            .success(function (data) {
                deferred.resolve(conversionService.convertFrom(resourceType, data));
            })
            .error(function(error, statusCode) {
                deferred.reject(conversionService.convertError(resourceType, error, statusCode));
            });
            return deferred.promise;
        },
        post: function(resourceType, url, data) {
            var converted = conversionService.convertTo(resourceType, data);
            var deferred = $q.defer();
            $http.post(url, converted)
            .success(function (data) {
                deferred.resolve(conversionService.convertFrom(resourceType, data));
            })
            .error(function(error, statusCode) {
                deferred.reject(conversionService.convertError(resourceType, error, statusCode));
            });
            return deferred.promise;
        },
        put: function(resourceType, url, data) {
            var converted = conversionService.convertTo(resourceType, data);
            var deferred = $q.defer();
            $http.put(url, converted)
            .success(function (data) {
                deferred.resolve(conversionService.convertFrom(resourceType, data));
            })
            .catch(function(error) {
                deferred.reject(conversionService.convertError(resourceType, error));
            });
            return deferred.promise;
        },
        delete: function(resourceType, url) {
            var deferred = $q.defer();
            $http.delete(url)
            .success(function () {
                deferred.resolve();
            })
            .error(function(error, statusCode) {
                deferred.reject(conversionService.convertError(resourceType, error, statusCode));
            });
            return deferred.promise;
        }
    }
}])

.service('applicationInfoConverter', function() {
    return {
        convertFrom: function (data) {
            return data;
        }
    }
});

module.exports = 'api';
