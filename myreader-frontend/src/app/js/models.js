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

    self.getTag = function (tag) {
        for (var i = 0; i < self.tags.length; i++) {
            var t = self.tags[i];
            if (t.title === tag) {
                return t;
            }
        }
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
