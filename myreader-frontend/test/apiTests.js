describe('test/apiTests.js', function() {

    var tag1, tag2, tag3, untagged1, untagged2, raw;

    beforeEach(module('common.api'));

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

    describe("subscriptionsTagConverter", function() {
        var converter,
            expectedCount = 334;

        beforeEach(inject(function (subscriptionsTagConverter) {
            converter = subscriptionsTagConverter;
        }));

        it('should return unseen count of ' + expectedCount, function () {
            var converted = converter.convertFrom(raw);
            expect(converted.unseen).toBe(expectedCount);
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

            var converted = converter.convertFrom(raw);

            expect(converted.unseen).toEqual(expectedCount);
            expect(converted.tags).toEqualData(expectedTags);
            expect(converted.subscriptions).toEqualData(expectedSubscriptions);
        });

        it('should return converted subscriptions without a tag as subscription objects', function () {
            var converted = converter.convertFrom(raw);
            expect(converted.subscriptions).toEqual([untagged1, untagged2]);
        });
    });

    describe("bookmarkTagsConverter", function() {
        var converter;

        beforeEach(inject(function (bookmarkTagsConverter) {
            converter = bookmarkTagsConverter;
        }));

        it('should return converted bookmarks', function () {
            var expectedTags = {
                tags: [
                    {
                        links: {},
                        title: 'all',
                        type: 'global'
                    },
                    {
                        links: {},
                        tag: [
                            {
                                uuid: '35',
                                title: 'tag1',
                                tag: 'news',
                                unseen: 106,
                                links: []
                            },
                            {
                                uuid: '36',
                                title: 'tag2',
                                tag: 'misc',
                                unseen: 102,
                                links: []
                            },
                            {
                                uuid: '1309597895632',
                                title: 'tag3',
                                tag: 'misc',
                                unseen: 32,
                                links: []
                            },
                            {
                                uuid: '52',
                                title: 'untagged',
                                tag: null,
                                unseen: 94,
                                links: []
                            },
                            {
                                uuid: '53',
                                title: 'untagged',
                                tag: '',
                                unseen: 0,
                                links: []
                            }
                        ],
                        title: [
                            {
                                uuid: '35',
                                title: 'tag1',
                                tag: 'news',
                                unseen: 106,
                                links: []
                            },
                            {
                                uuid: '36',
                                title: 'tag2',
                                tag: 'misc',
                                unseen: 102,
                                links: []
                            },
                            {
                                uuid: '1309597895632',
                                title: 'tag3',
                                tag: 'misc',
                                unseen: 32,
                                links: []
                            },
                            {
                                uuid: '52',
                                title: 'untagged',
                                tag: null,
                                unseen: 94,
                                links: []
                            },
                            {
                                uuid: '53',
                                title: 'untagged',
                                tag: '',
                                unseen: 0,
                                links: []
                            }
                        ],
                        type: 'tag'
                    }
                ]
            };

            var converted = converter.convertFrom(raw);

            expect(converted).toEqualData(expectedTags);
        });
    });

    describe("subscriptionEntriesConverter", function() {
        var converter,
            link = {
                rel: 'next',
                href: 'nextHref'
            };

        beforeEach(inject(function (subscriptionEntriesConverter) {
            converter = subscriptionEntriesConverter;
        }));

        it('should return empty object', function () {
            var converted = converter.convertFrom({content: [], links: []});

            expect(converted.entries).toEqual([]);
            expect(converted.links).toEqual([]);
        });

        it('should return empty object', function () {
            var converted = converter.convertFrom({content: undefined, links: undefined});

            expect(converted.entries).toEqual([]);
            expect(converted.links).toEqual([]);
        });

        it('should return links', function () {
            var converted = converter.convertFrom({content: undefined, links: [link]});

            expect(converted.links).toEqual([link]);
            expect(converted.entries).toEqual([]);
        });

        it('should return entries', function () {
            var converted = converter.convertFrom({content: [1], links: undefined});

            expect(converted.links).toEqual([]);
            expect(converted.entries).toEqual([1]);
        });

        it('should return undefined for rel "next"', function () {
            var converted = converter.convertFrom({content: undefined, links: [{ rel: "unknown" }]});

            expect(converted.next()).toEqual(undefined);
        });

        it('should return link for rel "next"', function () {
            var converted = converter.convertFrom({content: undefined, links: [link]});

            expect(converted.next()).toEqual('nextHref');
        });

        it('should return empty array', function () {
            var converted = converter.convertTo([]);

            expect(converted).toEqualData({content: []});
        });

        it('should return empty array', function () {
            var converted = converter.convertTo([{uuid: "1", seen: true, ignore: "me"}, {uuid: "2", tag: "tag", ignoreMeTwo: true}, {uuid: "3", seen: "true", tag : ""}, {seen: true}]);

            expect(converted).toEqualData({ content : [ { uuid : "1", seen : true }, { uuid : "2", tag : 'tag' }, { uuid : '3', tag : '' } ] });
        });


    });

    describe("SubscriptionTags object", function() {
        var converter;

        beforeEach(inject(function (subscriptionsTagConverter) {
            converter = subscriptionsTagConverter;
        }));

        it('should increment unseen count for all/tag/subscription', function () {
            var converted = converter.convertFrom(raw);

            var uuid = "36";
            var tag = converted.getTag("misc");
            var subscription = tag.subscriptions[0];

            expect(subscription.uuid).toEqual(uuid);

            var inc = 1;
            var expectedCount = converted.unseen;
            var expectedTagCount = tag.unseen;
            var expectedSubscriptionCount = subscription.unseen;

            var newExpectedCount = expectedCount + inc;
            var newExpectedTagCount = expectedTagCount + inc;
            var newExpectedSubscriptionCount = expectedSubscriptionCount + inc;

            expect(converted.unseen).toEqual(expectedCount);
            expect(tag.unseen).toEqual(expectedTagCount);
            expect(subscription.unseen).toEqual(expectedSubscriptionCount);

            converted.incrementSubscriptionUnseen(uuid);

            expect(converted.unseen).toEqual(newExpectedCount);
            expect(tag.unseen).toEqual(newExpectedTagCount);
            expect(subscription.unseen).toEqual(newExpectedSubscriptionCount);
        });

        it('should not increment', function () {
            var converted = converter.convertFrom(raw);

            var uuid = "37";
            var inc = 1;
            var expectedCount = converted.unseen;

            expect(converted.unseen).toEqual(expectedCount);

            converted.incrementSubscriptionUnseen(uuid, inc);

            expect(converted.unseen).toEqual(expectedCount);
        });

        it('should increment unseen count for all/subscription', function () {
            var converted = converter.convertFrom(raw);

            var uuid = "52";
            var subscription = converted.getSubscriptionByUuid(uuid);

            expect(subscription.uuid).toEqual(uuid);
            expect(subscription.tag).toEqual('');

            var inc = 1;
            var expectedCount = converted.unseen;
            var expectedSubscriptionCount = subscription.unseen;

            var newExpectedCount = expectedCount + inc;
            var newExpectedSubscriptionCount = expectedSubscriptionCount + inc;

            expect(converted.unseen).toEqual(expectedCount);
            expect(subscription.unseen).toEqual(expectedSubscriptionCount);

            converted.incrementSubscriptionUnseen(uuid);

            expect(converted.unseen).toEqual(newExpectedCount);
            expect(subscription.unseen).toEqual(newExpectedSubscriptionCount);
        });

        it('should decrement unseen count for all/subscription', function () {
            var converted = converter.convertFrom(raw);

            var uuid = "52";
            var subscription = converted.getSubscriptionByUuid(uuid);

            expect(subscription.uuid).toEqual(uuid);
            expect(subscription.tag).toEqual('');

            var dec = 1;
            var expectedCount = converted.unseen;
            var expectedSubscriptionCount = subscription.unseen;

            var newExpectedCount = expectedCount - dec;
            var newExpectedSubscriptionCount = expectedSubscriptionCount - dec;

            expect(converted.unseen).toEqual(expectedCount);
            expect(subscription.unseen).toEqual(expectedSubscriptionCount);

            converted.decrementSubscriptionUnseen(uuid);

            expect(converted.unseen).toEqual(newExpectedCount);
            expect(subscription.unseen).toEqual(newExpectedSubscriptionCount);
        });

        it('should return false for unknown tag', function () {
            var converted = converter.convertFrom(raw);

            expect(converted.containsTags("unknown")).toBe(false);
        });

        it('should return true for known tag', function () {
            var converted = converter.convertFrom(raw);

            expect(converted.containsTags("misc")).toBe(true);
        });

    });

    describe("subscriptionsConverter", function() {
        var converter;

        beforeEach(inject(function (subscriptionsConverter) {
            converter = subscriptionsConverter;
        }));

        it('should return body without enclosing content tag', function () {
            expect(converter.convertFrom({content: 1})).toBe(1);
        });
    });

    describe("subscriptionEntryTagConverter", function() {
        var converter;

        beforeEach(inject(function (subscriptionEntryTagConverter) {
            converter = subscriptionEntryTagConverter;
        }));

        it('should return data as is', function () {
            var data = {content: 1};
            expect(converter.convertFrom(data)).toBe(data);
        });
    });

    describe("subscriptionConverter", function() {
        var converter;

        beforeEach(inject(function (subscriptionConverter) {
            converter = subscriptionConverter;
        }));

        it('should return data as is', function () {
            var data = {content: 1};
            expect(converter.convertFrom(data)).toBe(data);
        });

        it('should convert data as is', function () {
            var data = {content: 1};
            expect(converter.convertTo(data)).toBe(data);
        });
    });

    describe("exclusionsConverter", function() {
        var converter;

        beforeEach(inject(function (exclusionsConverter) {
            converter = exclusionsConverter;
        }));

        it('should return body without enclosing content tag', function () {
            expect(converter.convertFrom({content: 1})).toBe(1);
        });
    });

    describe("exclusionConverter", function() {
        var converter;

        beforeEach(inject(function (exclusionConverter) {
            converter = exclusionConverter;
        }));

        it('should return data as is', function () {
            expect(converter.convertFrom(1)).toBe(1);
        });

        it('should convert data with enclosing pattern tag', function () {
            var data = {content: 1};
            expect(converter.convertTo(data)).toEqualData({pattern: data});
        });
    });

    describe("subscriptionTagConverter", function() {
        var converter;

        beforeEach(inject(function (subscriptionTagConverter) {
            converter = subscriptionTagConverter;
        }));

        it('should return data as is', function () {
            expect(converter.convertFrom(1)).toBe(1);
        });
    });

    describe("feedsConverter", function() {
        var converter;

        var link = {
            rel: 'next',
            href: 'nextHref'
        };

        beforeEach(inject(function (feedsConverter) {
            converter = feedsConverter;
        }));

        it('should return empty object', function () {
            var result = converter.convertFrom({content: undefined, links: undefined});

            expect(result.feeds).toEqual([]);
            expect(result.links).toEqual([]);
        });

        it('should return converted object', function () {
            var result = converter.convertFrom({content: [1], links: [link]});

            expect(result.feeds).toEqual([1]);
            expect(result.links).toEqual([link]);
        });

        it('should return href for rel "next"', function () {
            var result = converter.convertFrom({content: [1], links: [link]});

            expect(result.next()).toEqual(link.href);
        });

        it('should return undefined href for rel not equal to "next"', function () {
            var clone = angular.copy(link).rel = 'irrelevant';
            var result = converter.convertFrom({content: [1], links: [clone]});

            expect(result.next()).toEqual(undefined);
        });
    });

    describe("searchIndexJobConverter", function() {
        var converter;

        beforeEach(inject(function (searchIndexJobConverter) {
            converter = searchIndexJobConverter;
        }));

        it('should return empty json', function () {
            expect(converter.convertFrom(1)).toEqualData({});
        });

        it('should convert data with enclosing url tag', function () {
            var data = {content: 1};
            expect(converter.convertTo(data)).toEqualData({process  : data});
        });

        it('should return as is for error callback as is', function () {
            expect(converter.convertError(1)).toEqualData(1);
        });
    });

    describe("conversionService", function() {
        var service;

        beforeEach(inject(function (conversionService) {
            service = conversionService;
        }));

        it('should return empty json', function () {
            expect(service.convertFrom('searchIndexJob', 1)).toEqualData({});
        });

        it('should convert data with enclosing process tag', function () {
            expect(service.convertTo('searchIndexJob', 1)).toEqualData({process  : 1});
        });

        it('should convert data for error callback', function () {
            expect(service.convertError('searchIndexJob', {data: 1})).toEqualData({data: 1});
        });
    });

    describe("should", function() {
        var service,
            http;

        beforeEach(module(function($provide) {
            $provide.service('mockConverter', function() {
                return {
                    convertFrom: function(data) {
                        return data;
                    },
                    convertTo: function(data) {
                        return data;
                    },
                    convertError: function(data) {
                        return data;
                    }
                }
            })
        }));

        beforeEach(inject(function (api, $httpBackend) {
            service = api;
            http = $httpBackend;
        }));

        it('GET resource', function() {
            http.expectGET('testResource').respond({test: 1});

            var promise = service.get('mock', 'testResource');

            promise.then(function(data) {
                expect(data.test).toBe(1);
            });

            http.flush();
        });

        it('PATCH resource', function() {
            var data = {data: 2};
            http.expectPATCH('testResource', data).respond(200, {test: 3});

            var promise = service.patch('mock', 'testResource', data);

            promise.then(function(data) {
                expect(data.test).toBe(3);
            });

            http.flush();
        });

        it('POST resource', function() {
            var data = {data: 2};
            http.expectPOST('testResource', data).respond(200, {test: 3});

            var promise = service.post('mock', 'testResource', data);

            promise.then(function(data) {
                expect(data.test).toBe(3);
            });

            http.flush();
        });

        it('POST resource and return error', function() {
            var data = {data: 2};
            http.expectPOST('testResource', data).respond(401, {test: 3});

            var promise = service.post('mock', 'testResource', data);

            promise.then(function() {
                expect('success callback').not.toBeCalled();
            }).catch(function(data) {
                expect(data.test).toBe(3);
            });

            http.flush();
        });

        it('PUT resource', function() {
            var data = {data: 2};
            http.expectPUT('testResource', data).respond(200, {test: 3});

            var promise = service.put('mock', 'testResource', data);

            promise.then(function(data) {
                expect(data.test).toBe(3);
            });

            http.flush();
        });

        it('PUT resource and return error', function() {
            var data = {data: 2};
            http.expectPUT('testResource', data).respond(401, {test: 3});

            var promise = service.put('mock', 'testResource', data);

            promise.then(function() {
                expect('success callback').not.toBeCalled();
            }).catch(function(data) {
                expect(data.data.test).toBe(3);
            });

            http.flush();
        });

        it('DELETE resource', function() {
            http.expectDELETE('testResource').respond(201);

            var promise = service.delete('mock', 'testResource');

            promise.then(function(data) {
                expect(data).toBe(undefined);
            });

            http.flush();
        });

    });
});
