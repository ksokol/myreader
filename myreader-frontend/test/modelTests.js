import {SubscriptionTags} from '../src/app/js/models';

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
    });
});
