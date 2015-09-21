describe("api subscriptionsTagConverter", function() {
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

    beforeEach(module('common.api'));
    beforeEach(inject(function (subscriptionsTagConverter) {
        converter = subscriptionsTagConverter;
    }));

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

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
                links : [  ],
                type : 'subscription'
            },
            {
                uuid : '53',
                title : 'untagged',
                tag : '',
                unseen : 0,
                links : [  ],
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
