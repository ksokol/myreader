import {mockNgRedux} from '../src/app/js/shared/test-utils';

describe('test/serviceTests.js', function() {
    var service;

    beforeEach(angular.mock.module('common.services'));

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

        beforeEach(angular.mock.module('myreader', mockNgRedux()));

        beforeEach(inject(function ($httpBackend, subscriptionEntryService) {
            httpBackend = $httpBackend;
            service = subscriptionEntryService;
        }));

        it('should process own properties in params object', function(done) {
            httpBackend.expectGET('/myreader/api/2/subscriptionEntries?&param1=1&param2=2&size=10&seenEqual=false').respond({content: ['expected']});

            var Params = function() {
                this.param1 = 1;
                this.param2 = 2;
            };

            Params.prototype.param3 = 3;

            service.findBy(new Params)
                .then(function (data) {
                    expect(data).toEqual(['expected']);
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
