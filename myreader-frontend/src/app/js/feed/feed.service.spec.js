describe('src/app/js/feed/feed.service.spec.js', function() {

    var httpBackend, service;

    beforeEach(require('angular').mock.module('myreader'));

    beforeEach(inject(function ($httpBackend, feedService) {
        httpBackend = $httpBackend;
        service = feedService;
    }));

    it('should return converted feeds', function(done) {
        var actual = {
            "content": [{
                "uuid": "1",
                "title": "a title",
                "url": "a feed url",
                "lastModified": null,
                "fetched": 80,
                "hasErrors": false,
                "createdAt": "2015-08-01T18:54:05Z",
                "links": []
            }]
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
                expect(data).toEqual(expectedFeeds);
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
