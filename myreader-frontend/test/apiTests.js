describe('api', function() {

    beforeEach(module('common.api'));

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe("subscriptionsTagConverter", function() {
        var converter;

        var tag1 = {
            "uuid": "35",
            "title": "tag1",
            "tag": "news",
            "unseen": 106,
            "links": []
        };

        var tag2 = {
            "uuid": "36",
            "title": "tag2",
            "tag": "misc",
            "unseen": 102,
            "links": []
        };

        var tag3 = {
            "uuid": "1309597895632",
            "title": "tag3",
            "tag": "misc",
            "unseen": 32,
            "links": []
        };

        var untagged1 = {
            "uuid": "52",
            "title": "untagged",
            "tag": null,
            "unseen": 94,
            "links": []
        };

        var untagged2 = {
            "uuid": "53",
            "title": "untagged",
            "tag": "",
            "unseen": 0,
            "links": []
        };

        var raw = {
            "content": [tag1, tag2, tag3, untagged1, untagged2]
        };

        var expectedCount = 334;

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
                    links : {
                        entries : {
                            route : 'app.entries', param : {
                                tag : 'all', uuid : undefined
                            }
                        }
                    },
                    title : 'all', uuid : 'all', type : 'global', unseen : 334
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
                    links : {
                        entries :
                        {
                            route : 'app.entries',
                            param : {
                                tag : 'news',
                                uuid : undefined
                            }
                        }
                    },
                    uuid : 'news',
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
                    links :
                    {
                        entries : {
                            route : 'app.entries',
                            param : {
                                tag : 'misc',
                                uuid : undefined
                            }
                        }
                    },
                    uuid : 'misc',
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
                    tag : null,
                    unseen : 94,
                    links : {
                        entries : {
                            route : 'app.entries',
                            param : {
                                uuid : '52',
                                tag : '' }
                        }
                    },
                    type : 'subscription'
                },
                {
                    uuid : '53',
                    title : 'untagged',
                    tag : '',
                    unseen : 0,
                    links : {
                        entries : {
                            route : 'app.entries',
                            param : {
                                uuid : '53',
                                tag : '' }
                        }
                    },
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


    describe("subscriptionEntryConverter", function() {
        var converter;

        beforeEach(inject(function (subscriptionEntryConverter) {
            converter = subscriptionEntryConverter;
        }));

        it('should return data as is', function () {
            var data = {content: 1};
            expect(converter.convertFrom(data)).toBe(data);
        });

        it('should convert data as is', function () {
            var data = {
                tag: 'tag',
                seen: 'seen'
            };
            expect(converter.convertTo(data)).toEqualData({content: data});
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

    describe("feedProbeConverter", function() {
        var converter;

        beforeEach(inject(function (feedProbeConverter) {
            converter = feedProbeConverter;
        }));

        it('should return empty json', function () {
            expect(converter.convertFrom(1)).toEqualData({});
        });

        it('should convert data with enclosing url tag', function () {
            var data = {content: 1};
            expect(converter.convertTo(data)).toEqualData({url  : data});
        });

        it('should return as is  for error callback as is', function () {
            expect(converter.convertError(1)).toEqualData(1);
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
            var data = {content: 1};
            expect(service.convertTo('searchIndexJob', 1)).toEqualData({process  : 1});
        });

        it('should convert data for error callback', function () {
            expect(service.convertError('searchIndexJob', {data: 1})).toEqualData(1);
        });
    });
});
