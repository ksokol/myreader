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
});
