describe('test/modelTests.js', function() {

    describe("SubscriptionTags", function() {
        var expectedCount = 334;

        var tag1, tag2, tag3, untagged1, untagged2, raw;

        beforeEach(function () {
            tag1 = {
                "uuid": "35",
                "title": "tag1",
                "tag": "news",
                "unseen": 106,
                "links": []
            };

            tag2 = {
                "uuid": "36",
                "title": "tag2",
                "tag": "misc",
                "unseen": 102,
                "links": []
            };

            tag3 = {
                "uuid": "1309597895632",
                "title": "tag3",
                "tag": "misc",
                "unseen": 32,
                "links": []
            };

            untagged1 = {
                "uuid": "52",
                "title": "untagged",
                "tag": null,
                "unseen": 94,
                "links": []
            };

            untagged2 = {
                "uuid": "53",
                "title": "untagged",
                "tag": "",
                "unseen": 0,
                "links": []
            };

            raw = {
                "content": [tag1, tag2, tag3, untagged1, untagged2]
            };
        });

        it('should return unseen count of ' + expectedCount, function () {
            var subscriptionTags = new SubscriptionTags(raw.content);
            expect(subscriptionTags.unseen).toBe(expectedCount);
        });

        it('should return converted subscriptions with a tag as subscription tag objects', function () {
            var expectedTags = [
                {
                    subscriptions : [],
                    links : { },
                    title : 'all',
                    uuid : '',
                    tag : 'all',
                    type : 'global',
                    unseen : 334
                },
                {
                    subscriptions : [
                        {
                            uuid : '35',
                            title : 'tag1',
                            tag : 'news',
                            unseen : 106,
                            links : [  ]
                        }
                    ],
                    links : { },
                    uuid : '',
                    tag : 'news',
                    title : 'news',
                    type : 'tag',
                    unseen : 106
                },
                {
                    subscriptions : [
                        {
                            uuid : '36',
                            title : 'tag2',
                            tag : 'misc',
                            unseen : 102,
                            links : [  ]
                        },
                        {
                            uuid : '1309597895632',
                            title : 'tag3',
                            tag : 'misc',
                            unseen : 32,
                            links : [  ]
                        }
                    ],
                    links : { },
                    uuid : '',
                    tag : 'misc',
                    title : 'misc',
                    type : 'tag',
                    unseen : 134
                }
            ];

            var expectedSubscriptions = [
                {
                    uuid : '52',
                    title : 'untagged',
                    tag : '',
                    unseen : 94,
                    links : [],
                    type : 'subscription'
                },
                {
                    uuid : '53',
                    title : 'untagged',
                    tag : '',
                    unseen : 0,
                    links : [],
                    type : 'subscription'
                }
            ];

            var subscriptionTags = new SubscriptionTags(raw.content);

            expect(subscriptionTags.unseen).toEqual(expectedCount);
            expect(subscriptionTags.tags).toEqualData(expectedTags);
            expect(subscriptionTags.subscriptions).toEqualData(expectedSubscriptions);
        });

        it('should return converted subscriptions without a tag as subscription objects', function () {
            var subscriptionTags = new SubscriptionTags(raw.content);
            expect(subscriptionTags.subscriptions).toEqual([untagged1, untagged2]);
        });

        it('should increment unseen count for all/tag/subscription', function () {
            var subscriptionTags = new SubscriptionTags(raw.content);

            var uuid = "36";
            var tag = subscriptionTags.getTag("misc");
            var subscription = tag.subscriptions[0];

            expect(subscription.uuid).toEqual(uuid);

            var inc = 1;
            var expectedCount = subscriptionTags.unseen;
            var expectedTagCount = tag.unseen;
            var expectedSubscriptionCount = subscription.unseen;

            var newExpectedCount = expectedCount + inc;
            var newExpectedTagCount = expectedTagCount + inc;
            var newExpectedSubscriptionCount = expectedSubscriptionCount + inc;

            expect(subscriptionTags.unseen).toEqual(expectedCount);
            expect(tag.unseen).toEqual(expectedTagCount);
            expect(subscription.unseen).toEqual(expectedSubscriptionCount);

            subscriptionTags.incrementSubscriptionUnseen(uuid);

            expect(subscriptionTags.unseen).toEqual(newExpectedCount);
            expect(tag.unseen).toEqual(newExpectedTagCount);
            expect(subscription.unseen).toEqual(newExpectedSubscriptionCount);
        });


        it('should not increment', function () {
            var subscriptionTags = new SubscriptionTags(raw.content);

            var uuid = "37";
            var inc = 1;
            var expectedCount = subscriptionTags.unseen;

            expect(subscriptionTags.unseen).toEqual(expectedCount);

            subscriptionTags.incrementSubscriptionUnseen(uuid, inc);

            expect(subscriptionTags.unseen).toEqual(expectedCount);
        });

        it('should increment unseen count for all/subscription', function () {
            var subscriptionTags = new SubscriptionTags(raw.content);

            var uuid = "52";
            var subscription = subscriptionTags.getSubscriptionByUuid(uuid);

            expect(subscription.uuid).toEqual(uuid);
            expect(subscription.tag).toEqual('');

            var inc = 1;
            var expectedCount = subscriptionTags.unseen;
            var expectedSubscriptionCount = subscription.unseen;

            var newExpectedCount = expectedCount + inc;
            var newExpectedSubscriptionCount = expectedSubscriptionCount + inc;

            expect(subscriptionTags.unseen).toEqual(expectedCount);
            expect(subscription.unseen).toEqual(expectedSubscriptionCount);

            subscriptionTags.incrementSubscriptionUnseen(uuid);

            expect(subscriptionTags.unseen).toEqual(newExpectedCount);
            expect(subscription.unseen).toEqual(newExpectedSubscriptionCount);
        });

        it('should decrement unseen count for all/subscription', function () {
            var subscriptionTags = new SubscriptionTags(raw.content);

            var uuid = "52";
            var subscription = subscriptionTags.getSubscriptionByUuid(uuid);

            expect(subscription.uuid).toEqual(uuid);
            expect(subscription.tag).toEqual('');

            var dec = 1;
            var expectedCount = subscriptionTags.unseen;
            var expectedSubscriptionCount = subscription.unseen;

            var newExpectedCount = expectedCount - dec;
            var newExpectedSubscriptionCount = expectedSubscriptionCount - dec;

            expect(subscriptionTags.unseen).toEqual(expectedCount);
            expect(subscription.unseen).toEqual(expectedSubscriptionCount);

            subscriptionTags.decrementSubscriptionUnseen(uuid);

            expect(subscriptionTags.unseen).toEqual(newExpectedCount);
            expect(subscription.unseen).toEqual(newExpectedSubscriptionCount);
        });

        it('should return false for unknown tag', function () {
            var subscriptionTags = new SubscriptionTags(raw.content);

            expect(subscriptionTags.containsTags("unknown")).toBe(false);
        });

        it('should return true for known tag', function () {
            var subscriptionTags = new SubscriptionTags(raw.content);

            expect(subscriptionTags.containsTags("misc")).toBe(true);
        });
    });

    describe('SubscriptionEntries', function () {
        var link = {
                rel: 'next',
                href: 'nextHref'
            };

        it('should return empty object', function () {
            var subscriptionEntries = new SubscriptionEntries([], []);

            expect(subscriptionEntries.entries).toEqual([]);
            expect(subscriptionEntries.links).toEqual([]);
        });

        it('should return empty object', function () {
            var subscriptionEntries = new SubscriptionEntries(undefined, undefined);

            expect(subscriptionEntries.entries).toEqual([]);
            expect(subscriptionEntries.links).toEqual([]);
        });

        it('should return links', function () {
            var subscriptionEntries = new SubscriptionEntries(undefined, [link]);

            expect(subscriptionEntries.links).toEqual([link]);
            expect(subscriptionEntries.entries).toEqual([]);
        });

        it('should return entries', function () {
            var subscriptionEntries = new SubscriptionEntries([1], undefined);

            expect(subscriptionEntries.links).toEqual([]);
            expect(subscriptionEntries.entries).toEqual([1]);
        });

        it('should return undefined for rel "next"', function () {
            var subscriptionEntries = new SubscriptionEntries(undefined, [{ rel: "unknown" }]);

            expect(subscriptionEntries.next()).toEqual(undefined);
        });

        it('should return link for rel "next"', function () {
            var subscriptionEntries = new SubscriptionEntries(undefined, [link]);

            expect(subscriptionEntries.next()).toEqual('nextHref');
        });
    });
});
