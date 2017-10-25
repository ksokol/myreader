export function SubscriptionEntries(entries, links) {
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

    self.next = function () {
        return getLink('next');
    };
}

export function Bookmarks(data) {
    var self = this;
    self.tags = [];

    self.addTag = function (bookmarkTag) {
        var tag = {};
        tag.tag = bookmarkTag;
        tag.title = bookmarkTag;
        tag.type = 'tag';
        self.tags.push(tag);
    };

    for (var i = 0; i < data.length; i++) {
        self.addTag(data[i]);
    }
};

export function SubscriptionTag () {
    var self = this;
    self.subscriptions = [];
    self.links = {};
};

export function SubscriptionTags(data) {
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

    var all = new SubscriptionTag;
    all.title = "all";
    all.uuid = "";
    all.tag = "all";
    all.subscriptions = [];
    all.type = 'global';

    for (var i = 0; i < data.length; i++) {
        var value = data[i];
        if (!value.tag) {
            self.addSubscription(value);
        } else {
            self.addTag(value);
        }
    }

    all.unseen = self.unseen;
    self.tags.unshift(all);
}
