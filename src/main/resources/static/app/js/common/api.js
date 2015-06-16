angular.module('common.api', [])

.service('subscriptionTagConverter', function () {

    var SubscriptionTag = function () {
        var self = this;
        self.subscriptions = [];
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
            return self.getTag(tag) === undefined;
        };

        self.addSubscription = function(subscription) {
            subscription['type'] = 'subscription';
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

.service('subscriptionEntriesConverter', function() {

    var SubscriptionEntries = function(entries, links) {
        var self = this;
        self.entries = entries;
        self.links = angular.isArray(links) ? links : [];

        var getLink = function(rel) {
            if(rel) {
                for(var i=0;i<links.length;i++) {
                    if(links[i].rel === rel) {
                        return links[i].href;
                    }
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
                converted.push({uuid: val.uuid, seen: val.seen, tag: val.tag});
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

.service('conversionService', function ($injector) {
    return {
        convertFrom: function (resourceType, data) {
            return $injector.get(resourceType + "Converter").convertFrom(data);
        },
        convertTo: function (resourceType, data) {
            return $injector.get(resourceType + "Converter").convertTo(data);
        }
    }
})

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
        }
    }
}]);
