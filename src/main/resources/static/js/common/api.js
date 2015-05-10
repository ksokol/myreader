angular.module('common.api', [])

.service('subscriptionTagConverter', function () {

    var Subscription = function () {
        var self = this;

        self.getLink = function(rel) {
            for(i=0; i < self.links.length; i++) {
                if(self.links[i].rel === rel) {
                    return self.links[i];
                }
            }
        }
    };

    var SubscriptionTag = function () {
        var self = this;
        self.subscriptions = [];

        self.getLink = function(rel) {
            for(i=0; i < self.links.length; i++) {
                if(self.links[i].rel === rel) {
                    return self.links[i];
                }
            }
        }
    };

    var SubscriptionTags = function() {
        var self = this;
        self.tags = [];
        self.subscriptions = [];

        self.getTag = function(tag) {
            for(i=0;i<self.tags.length;i++) {
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
            var s = new Subscription;
            angular.forEach(subscription, function (v, k) {
                s[k] = v;
            });
            self.subscriptions.push(s);
        };

        self.addTag = function(subscriptionTag) {
            var s = new SubscriptionTag;
            angular.forEach(subscriptionTag, function (v, k) {
                s[k] = v;
            });

            var theTag = self.getTag(s.tag);

            if(theTag) {
                theTag.unseen += s.unseen;
                theTag.subscriptions.push(s);
            } else {
                var tag = new SubscriptionTag;
                tag.uuid = s.tag;
                tag.title = s.tag;
                tag.unseen = s.unseen;
                tag.subscriptions.push(s);
                self.tags.push(tag);
            }
        }
    };

    return {
        convertFrom: function (data) {
            var subscriptionTags = new SubscriptionTags;
            angular.forEach(data.content, function (value) {
                if(!value.tag) {
                    subscriptionTags.addSubscription(value);
                } else {
                    subscriptionTags.addTag(value);
                }
            });

            var tmp = subscriptionTags.tags.concat(subscriptionTags.subscriptions);
            var count = 0;
            for(i=0;i<tmp.length;i++) {
                count += tmp[i].unseen;
            }

            var all = new SubscriptionTag;
            all.unseen = count;
            all.title = "all";
            subscriptionTags.tags.unshift(all);

            return subscriptionTags;
        }
    }
})

.service('subscriptionEntryConverter', function() {

    var SubscriptionEntry = function() {};

    return {
        convertFrom: function (data) {
            var subscriptionEntries = [];
            angular.forEach(data.content, function (value) {
                var subscriptionEntry = new SubscriptionEntry;
                angular.forEach(value, function (v, k) {
                    subscriptionEntry[k] = v;
                });
                subscriptionEntries.push(subscriptionEntry);
            });
            return subscriptionEntries;
        },
        convertTo: function(data) {
            return {content: data};
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
        get: function (resourceType, href) {
            var deferred = $q.defer();
            $http.get(href)
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
                deferred.resolve();
            });
            return deferred.promise;
        }
    }
}]);
