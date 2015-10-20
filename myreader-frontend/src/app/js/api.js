angular.module('common.api', [])

.service('subscriptionsTagConverter', function () {

    var SubscriptionTag = function () {
        var self = this;
        self.subscriptions = [];
        self.links = {};
    };

    var SubscriptionTags = function() {
        var self = this;
        self.unseen = 0;
        self.tags = [];
        self.subscriptions = [];

        self.updateSubscriptionUnseen = function(uuid, value) {
            var subscription = self.getSubscriptionByUuid(uuid);

            if(subscription) {
                subscription.unseen += value;
                self.unseen += value;

                var all = self.getTag('all');
                all.unseen += value;

                var subscriptionTag = self.getTag(subscription.tag);

                if(subscriptionTag) {
                    subscriptionTag.unseen += value;
                }
            }
        };

        self.getTag = function(tag) {
            for(var i=0;i<self.tags.length;i++) {
                var t = self.tags[i];
                if(t.title === tag) {
                    return t;
                }
            }
        };

        self.containsTags = function(tag) {
            return self.getTag(tag) !== undefined;
        };

        self.addSubscription = function(subscription) {
            subscription['type'] = 'subscription';
            subscription['links'] = {
                entries: {
                    route: 'app.entries', param: {
                        uuid: subscription.uuid, tag: ''
                    }
                }
            };
            self.subscriptions.push(subscription);
            self.unseen += subscription.unseen;
        };

        self.addTag = function(subscriptionTag) {
            var theTag = self.getTag(subscriptionTag.tag);
            self.unseen += subscriptionTag.unseen;

            if(theTag) {
                theTag.unseen += subscriptionTag.unseen;
                theTag.subscriptions.push(subscriptionTag);
            } else {
                var tag = new SubscriptionTag;
                tag.uuid = subscriptionTag.tag;
                tag.tag = subscriptionTag.tag;
                tag.title = subscriptionTag.tag;
                tag.type = 'tag';
                tag.unseen = subscriptionTag.unseen;
                tag.links.entries = {route: 'app.entries', param: { tag: subscriptionTag.tag, uuid: undefined } };
                tag.subscriptions.push(subscriptionTag);
                self.tags.push(tag);
            }
        };

        self.getSubscriptionByUuid = function(uuid) {
            for(var i=0;i<self.subscriptions.length;i++) {
                if(self.subscriptions[i].uuid === uuid) {
                    return self.subscriptions[i];
                }
            }

            for(var j=0;j<self.tags.length;j++) {
                var tag = self.tags[j];

                for(var k=0;k<tag.subscriptions.length;k++) {
                    if(tag.subscriptions[k].uuid === uuid) {
                        return tag.subscriptions[k];
                    }
                }
            }
        };

        self.incrementSubscriptionUnseen = function(uuid) {
            self.updateSubscriptionUnseen(uuid, 1);
        };

        self.decrementSubscriptionUnseen = function(uuid) {
            self.updateSubscriptionUnseen(uuid, -1);
        };
    };

    return {
        convertFrom: function (data) {
            var all = new SubscriptionTag;
            all.title = "all";
            all.uuid = "all";
            all.subscriptions = [];
            all.type = 'global';
            all.links.entries = {route: 'app.entries', param: {tag: 'all', uuid: undefined }};

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
        }
    }
})

.service('bookmarkTagsConverter', function () {

    var Bookmark = function () {
        var self = this;
        self.links = {};
    };

    var Bookmarks = function() {
        var self = this;
        self.tags = [];

        self.addTag = function(bookmarkTag) {
            var tag = new Bookmark;
            tag.tag = bookmarkTag;
            tag.title = bookmarkTag;
            tag.type = 'tag';
            tag.links.entries = {route: 'app.bookmarks', param: { tag: bookmarkTag } };
            self.tags.push(tag);
        };
    };

    return {
        convertFrom: function (data) {
            var all = new Bookmark;
            all.title = "all";
            all.type = 'global';
            all.links.entries = {route: 'app.bookmarks', param: {tag: 'all' }};

            var subscriptionTags = new Bookmarks;

            angular.forEach(data, function (value) {
                subscriptionTags.addTag(value);
            });

            subscriptionTags.tags.unshift(all);
            return subscriptionTags;
        }
    }
})

.service('subscriptionEntriesConverter', function() {

    var SubscriptionEntries = function(entries, links) {
        var self = this;
        self.entries = angular.isArray(entries) ? entries : [];
        self.links = angular.isArray(links) ? links : [];

        var getLink = function(rel) {
            for(var i=0;i<self.links.length;i++) {
                if(self.links[i].rel === rel) {
                    return self.links[i].href;
                }
            }
        };

        self.next = function() {
            return getLink('next');
        };
    };

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
        }
    }
})

.service('subscriptionEntryConverter', function() {

    return {
        convertFrom: function (data) {
            return data;
        },
        convertTo: function(data) {
            return {content: {tag: data.tag, seen: data.seen}};
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
            return data;
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
.service('feedProbeConverter', function() {
    return {
        convertFrom: function () {
            return {};
        },
        convertTo: function(data) {
            return { url: data };
        },
        convertError: function (data) {
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
        convertError: function (resourceType, data) {
            return $injector.get(resourceType + "Converter").convertError(data.data);
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
            });
            return deferred.promise;
        },
        patch: function(resourceType, url, data) {
            var converted = conversionService.convertTo(resourceType, data);
            var deferred = $q.defer();
            $http.patch(url, converted)
            .success(function (data) {
                deferred.resolve(conversionService.convertFrom(resourceType, data));
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
            .catch(function(error) {
                deferred.reject(conversionService.convertError(resourceType, error));
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
            .success(function (data) {
                deferred.resolve();
            });
            return deferred.promise;
        }
    }
}]);
