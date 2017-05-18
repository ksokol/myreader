module.exports = function models() {

    this.SubscriptionEntries = function (entries, links) {
        var self = this;
        self.entries = angular.isArray(entries) ? entries : [];
        self.links = angular.isArray(links) ? links : [];

        var getLink = function (rel) {
            for (var i = 0; i < self.links.length; i++) {
                if (self.links[i].rel === rel) {
                    return self.links[i].href;
                }
            }
        };

        self.extractNext = function () {
            var string = self.next();

            if (string) {
                var matches = string.match(/next=[0-9]*/);
                if (matches) {
                    return parseInt(matches[0].substring(5));
                }
            }

            return null;
        };

        self.next = function () {
            return getLink('next');
        };

        self.contains = function (uuid) {
            for (var i = 0; i < self.entries.length; i++) {
                if (self.entries[i].uuid === uuid) {
                    return true;
                }
            }
            return false;
        };

        self.merge = function (other) {
            for (var i = 0; i < other.entries.length; i++) {
                var entryOthers = other.entries[i];
                var newOne = true;

                for (var j = 0; j < self.entries.length; j++) {
                    var entrySelf = self.entries[j];

                    if (entryOthers.uuid === entrySelf.uuid) {
                        newOne = false;
                        break;
                    }
                }

                if (newOne) {
                    self.entries.push(entryOthers);
                }
            }

            if (other.extractNext() < self.extractNext()) {
                self.links = other.links;
            }
        };
    };

    this.Bookmark = function () {
        var self = this;
        self.links = {};
    };

    this.Bookmarks = function () {
        var self = this;
        self.tags = [];

        self.addTag = function (bookmarkTag) {
            var tag = new Bookmark;
            tag.tag = bookmarkTag;
            tag.title = bookmarkTag;
            tag.type = 'tag';
            self.tags.push(tag);
        };
    };

    this.SubscriptionTag = function () {
        var self = this;
        self.subscriptions = [];
        self.links = {};
    };

    this.SubscriptionTags = function () {
        var self = this;
        self.unseen = 0;
        self.tags = [];
        self.subscriptions = [];

        self.updateSubscriptionUnseen = function (uuid, value) {
            var subscription = self.getSubscriptionByUuid(uuid);

            if (subscription) {
                subscription.unseen += value;
                self.unseen += value;

                var all = self.getTag('all');
                all.unseen += value;

                var subscriptionTag = self.getTag(subscription.tag);

                if (subscriptionTag) {
                    subscriptionTag.unseen += value;
                }
            }
        };

        self.getTag = function (tag) {
            for (var i = 0; i < self.tags.length; i++) {
                var t = self.tags[i];
                if (t.title === tag) {
                    return t;
                }
            }
        };

        self.containsTags = function (tag) {
            return self.getTag(tag) !== undefined;
        };

        self.addSubscription = function (subscription) {
            subscription['type'] = 'subscription';
            subscription.tag = subscription.tag === null ? '' : subscription.tag;
            self.subscriptions.push(subscription);
            self.unseen += subscription.unseen;
        };

        self.addTag = function (subscriptionTag) {
            var theTag = self.getTag(subscriptionTag.tag);
            self.unseen += subscriptionTag.unseen;

            if (theTag) {
                theTag.unseen += subscriptionTag.unseen;
                theTag.subscriptions.push(subscriptionTag);
            } else {
                var tag = new SubscriptionTag;
                tag.uuid = '';
                tag.tag = subscriptionTag.tag;
                tag.title = subscriptionTag.tag;
                tag.type = 'tag';
                tag.unseen = subscriptionTag.unseen;
                tag.subscriptions.push(subscriptionTag);
                self.tags.push(tag);
            }
        };

        self.getSubscriptionByUuid = function (uuid) {
            for (var i = 0; i < self.subscriptions.length; i++) {
                if (self.subscriptions[i].uuid === uuid) {
                    return self.subscriptions[i];
                }
            }

            for (var j = 0; j < self.tags.length; j++) {
                var tag = self.tags[j];

                for (var k = 0; k < tag.subscriptions.length; k++) {
                    if (tag.subscriptions[k].uuid === uuid) {
                        return tag.subscriptions[k];
                    }
                }
            }
        };

        self.incrementSubscriptionUnseen = function (uuid) {
            self.updateSubscriptionUnseen(uuid, 1);
        };

        self.decrementSubscriptionUnseen = function (uuid) {
            self.updateSubscriptionUnseen(uuid, -1);
        };
    };
}();
