describe('test/serviceTests.js', function() {
    var api, service;

    beforeEach(module('common.services'));

    beforeEach(module(function($provide) {
        api = {
            get: jasmine.createSpy(),
            post: jasmine.createSpy(),
            delete: jasmine.createSpy(),
            patch: jasmine.createSpy(),
            put: jasmine.createSpy()
        };

        $provide.service('api', function() {
            return api;
        });
    }));

    describe('subscriptionsTagService', function() {

        describe('with real cache', function() {

            var httpBackend;

            beforeEach(inject(function ($httpBackend, subscriptionsTagService) {
                httpBackend = $httpBackend;
                service = subscriptionsTagService;
            }));

            it('should return entries when called with unseen set to false', function(done) {
                httpBackend.expectGET('/myreader/api/2/subscriptions').respond({ content: [] });

                service.findAllByUnseen(false)
                    .then(function (data) {
                        expect(data.unseen).toEqual(0);
                        expect(data.tags.length).toEqual(1);
                        expect(data.subscriptions.length).toEqual(0);
                        done();
                    });

                httpBackend.flush();
            });
        });
    });

    describe('subscriptionEntryService', function() {
        var httpBackend;

        beforeEach(inject(function ($httpBackend, subscriptionEntryService) {
            httpBackend = $httpBackend;
            service = subscriptionEntryService;
        }));

        it('should process own properties in params object', function(done) {
            httpBackend.expectGET('/myreader/api/2/subscriptionEntries?&param1=1&param2=2').respond({ content: 'expected' });

            var Params = function() {
                this.param1 = 1;
                this.param2 = 2;
            };

            Params.prototype.param3 = 3;

            service.findBy(new Params)
                .then(function (data) {
                    expect(data.entries).toEqual([]);
                    done();
                });

            httpBackend.flush();
        });

        it('should save entries', function(done) {
            var entry = {
               uuid: '1',
               seen: true,
               tag: 'tag'
            };

            httpBackend
                .expectPATCH('/myreader/api/2/subscriptionEntries?', { content: [ entry ]})
                .respond({ content: [ entry ] });

            service.save(entry)
                .then(function (data) {
                    expect(data).toEqualData(entry);
                    done();
                });

            httpBackend.flush();
        });

        it('should return empty array', function () {
            httpBackend
                .expectPATCH('/myreader/api/2/subscriptionEntries?', { content: [] })
                .respond({ content: [] });

            service.updateEntries([]);
            httpBackend.flush();
        });

        it('should return empty array', function () {
            var entries = [{uuid: "1", seen: true, ignore: "me"}, {uuid: "2", tag: "tag", ignoreMeTwo: true}, {uuid: "3", seen: "true", tag : ""}, {seen: true}];
            var expected = { content : [ { uuid : "1", seen : true }, { uuid : "2", tag : 'tag' }, { uuid : '3', tag : '' } ] };

            httpBackend
                .expectPATCH('/myreader/api/2/subscriptionEntries?', expected)
                .respond({ content: [] });

            service.updateEntries(entries);
            httpBackend.flush();
        });
    });

    describe('subscriptionService', function() {
        var httpBackend;

        beforeEach(inject(function ($httpBackend, subscriptionService) {
            httpBackend = $httpBackend;
            service = subscriptionService;
        }));

        it('should return expected body', function(done) {
            httpBackend.expectGET('/myreader/api/2/subscriptions').respond({ content: 'expected' });

            service.findAll()
                .then(function (data) {
                    expect(data).toEqual('expected');
                    done();
                });

            httpBackend.flush();
        });

        it('should return expected body', function(done) {
            httpBackend.expectGET('/myreader/api/2/subscriptions/subscriptionUuid').respond('expected');

            service.find('subscriptionUuid')
            .then(function (data) {
                expect(data).toEqual('expected');
                done();
            });

            httpBackend.flush();
        });

        it('should post subscription when uuid is missing', function(done) {
            var subscription = { tag: 'tag' };

            httpBackend.expectPOST('/myreader/api/2/subscriptions', subscription).respond('expected');

            service.save(subscription)
                .then(function (data) {
                    expect(data).toEqual('expected');
                    done();
                });

            httpBackend.flush();
        });

        it('should convert empty tag to null', function(done) {
            httpBackend.expectPOST('/myreader/api/2/subscriptions', { tag: null }).respond('expected');

            service.save({ tag: '' })
                .then(function (data) {
                    expect(data).toEqual('expected');
                    done();
                });

            httpBackend.flush();
        });

        it('should patch existing subscription when uuid exists', function(done) {
            var subscription = { uuid: '1' };

            httpBackend.expectPATCH('/myreader/api/2/subscriptions/1', subscription).respond('expected');

            service.save(subscription)
                .then(function (data) {
                    expect(data).toEqual('expected');
                    done();
                });

            httpBackend.flush();
        });

        it('should delete subscription', function(done) {
            httpBackend.expectDELETE('/myreader/api/2/subscriptions/1').respond();

            service.unsubscribe({ uuid: '1' })
                .then(function () {
                    done()
                });

            httpBackend.flush();
        });
    });

    describe('exclusionService', function() {
        var httpBackend;

        beforeEach(inject(function ($httpBackend, exclusionService) {
            httpBackend = $httpBackend;
            service = exclusionService;
        }));

        it('should return expected body', function(done) {
            httpBackend.expectGET('/myreader/api/2/exclusions/exclusionUuid/pattern').respond({ content: 'expected' });

            service.find('exclusionUuid')
                .then(function (data) {
                    expect(data).toEqual('expected');
                    done();
                });

            httpBackend.flush();
        });

        it('should post expected body', function(done) {
            httpBackend
                .expectPOST('/myreader/api/2/exclusions/exclusionUuid/pattern', { pattern: 'secondParam' })
                .respond({ content: 'expected' });

            service.save('exclusionUuid', 'secondParam')
                .then(function (data) {
                    expect(data).toEqual('expected');
                    done();
                });

            httpBackend.flush();
        });

        it('should delete', function(done) {
            httpBackend
                .expectDELETE('/myreader/api/2/exclusions/subscriptionUuid/pattern/exclusionUuid')
                .respond();

            service.delete('subscriptionUuid', 'exclusionUuid')
                .then(done);

            httpBackend.flush();
        });
    });

    describe('subscriptionTagService', function() {

        var httpBackend;

        beforeEach(inject(function (subscriptionTagService, $httpBackend) {
            service = subscriptionTagService;
            httpBackend = $httpBackend;
        }));

        it('should return tags', function(done) {
            httpBackend.expectGET('/myreader/api/2/subscriptions/availableTags').respond(["","tag1","tag2"]);

            service.findAll()
            .then(function (data) {
                expect(data).toEqual(["","tag1","tag2"]);
                done();
            });

            httpBackend.flush();
        });
    });

    describe('feedService', function() {
        var httpBackend;

        beforeEach(inject(function ($httpBackend, feedService) {
            httpBackend = $httpBackend;
            service = feedService;
        }));

        it('should return converted feeds', function(done) {
            var actual = {
                "links": [{
                    "rel": "next",
                    "href": "next url"
                }],
                "content": [{
                    "uuid": "1",
                    "title": "a title",
                    "url": "a feed url",
                    "lastModified": null,
                    "fetched": 80,
                    "hasErrors": false,
                    "createdAt": "2015-08-01T18:54:05Z",
                    "links": []
                }],
                "page": {
                    "size": 0,
                    "totalElements": 1,
                    "totalPages": 1,
                    "number": 0
                }
            };

            var expectedFeeds = [{
                "uuid": "1",
                "title": "a title",
                "url": "a feed url",
                "lastModified": null,
                "fetched": 80,
                "hasErrors": false,
                "createdAt": "2015-08-01T18:54:05Z",
                "links": []
            }];

            httpBackend.expectGET('/myreader/api/2/feeds').respond(actual);

            service.findAll()
                .then(function (data) {
                    expect(data.next()).toEqual('next url');
                    expect(data.feeds).toEqualData(expectedFeeds);
                    done();
                });

            httpBackend.flush();
        });

        it('should find one', function(done) {
            httpBackend.expectGET('/myreader/api/2/feeds/1').respond('expected');

            service.findOne('1')
                .then(function (data) {
                    expect(data).toEqual('expected');
                    done();
                });

            httpBackend.flush();
        });

        it('should patch existing feed', function(done) {
            var feed = {
                uuid: '1',
                title: 'new title',
                url: 'new url',
                prop1: 'prop1'
            };

            httpBackend.expectPATCH('/myreader/api/2/feeds/1', { title: 'new title', url: 'new url'}).respond('expected');

            service.save(feed)
                .then(function (data) {
                    expect(data).toEqual('expected');
                    done();
                });

            httpBackend.flush();
        });

        it('should delete feed', function(done) {
            httpBackend.expectDELETE('/myreader/api/2/feeds/1').respond();

            service.remove({ uuid: '1'})
                .then(function () {
                    done();
                });

            httpBackend.flush();
        });
    });

    describe('bookmarkService', function() {

        var httpBackend;

        beforeEach(inject(function ($rootScope, bookmarkService, $httpBackend) {
            service = bookmarkService;
            httpBackend = $httpBackend;
        }));

        it('should return converted result', function(done) {
            var tag1 = {
                "title": "tag1",
                "tag": "tag1",
                "type": "tag"
            };
            var tag2 = {
                "title": "tag2",
                "tag": "tag2",
                "type": "tag"
            };

            httpBackend.expectGET('/myreader/api/2/subscriptionEntries/availableTags').respond([ 'tag1', 'tag2']);

            service.findAll()
            .then(function (data) {
                expect(data.tags).toEqualData([ tag1, tag2 ]);
                done();
            });

            httpBackend.flush();
        });
    });

    describe('processingService', function() {

        var httpBackend;

        beforeEach(inject(function (processingService, $httpBackend) {
            service = processingService;
            httpBackend = $httpBackend;
        }));

        it('should have been called rebuildSearchIndex', function(done) {
            httpBackend.expectPUT('/myreader/api/2/processing').respond({});

            service.rebuildSearchIndex()
            .success(function () {
                done();
            });

            httpBackend.flush();
        });
    });

    describe('settingsService', function() {

        beforeEach(inject(function (settingsService) {
            service = settingsService;
            localStorage.clear();
        }));

        it('should return pageSize equal to 10', function() {
            var pageSize = service.getPageSize();

            expect(pageSize).toBe(10);
        });

        it('should return pageSize equal to 20', function() {
            service.setPageSize(20);
            var pageSize = service.getPageSize();

            expect(pageSize).toBe(20);
        });

        it('should return "true" for method call isShowEntryDetails', function() {
            service.setShowEntryDetails(true);
            var pageSize = service.isShowEntryDetails();

            expect(pageSize).toBe(true);
        });

        it('should return "false" for method call isShowEntryDetails', function() {
            expect(service.isShowEntryDetails()).toBe(false);
        });

        it('should return "false" for method call isShowUnseenEntries', function() {
            service.setShowUnseenEntries(undefined);
            expect(service.isShowUnseenEntries()).toBe(false);
        });

        it('should return "false" for method call isShowUnseenEntries', function() {
            expect(service.isShowUnseenEntries()).toBe(false);
        });

        it('should return "true" for method call isShowUnseenEntries', function() {
            service.setShowUnseenEntries(true);
            var pageSize = service.isShowUnseenEntries();

            expect(pageSize).toBe(true);
        });
    });
});
