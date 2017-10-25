describe('src/app/js/feed/feed-fetch-error-panel/feed-fetch-error/feed-fetch-error.service.spec.js', function () {

    var httpBackend, service;

    var page0 = {
        "links": [{
            "rel": "next",
            "href": "/api/2/feeds/1/fetchError?page=1"
        }],
        "content": [{
            "uuid": "1",
            "message": "error1",
            "retainDays": 7,
            "createdAt": "2017-04-28T18:01:03Z",
            "links": []
        }],
        "page": {
            "size": 1,
            "totalElements": 2,
            "totalPages": 2,
            "number": 0
        }
    };

    var page1 = {
        "links": [],
        "content": [{
            "uuid": "2",
            "message": "error2",
            "retainDays": 7,
            "createdAt": "2017-04-28T18:01:03Z",
            "links": []
        }],
        "page": {
            "size": 1,
            "totalElements": 2,
            "totalPages": 2,
            "number": 1
        }
    };

    var noElements = {
        "links": [],
        "content": [],
        "page": {
            "size": 1,
            "totalElements": 0,
            "totalPages": 0,
            "number": 2
        }
    };

    beforeEach(require('angular').mock.module('myreader'));

    beforeEach(inject(function ($httpBackend, feedFetchErrorService) {
        httpBackend = $httpBackend;
        service = feedFetchErrorService;
    }));

    it('should contain fetch errors on first page', function(done) {
        httpBackend.expectGET('/myreader/api/2/feeds/1/fetchError').respond(page0);

        service.findByFeedId(1)
            .then(function (data) {
                expect(data.fetchError).toEqual(page0.content);
                done();
            });

        httpBackend.flush();
    });

    it('should contain next link on first page', function(done) {
        httpBackend.expectGET('/myreader/api/2/feeds/1/fetchError').respond(page0);

        service.findByFeedId(1)
            .then(function (data) {
                expect(data.next()).toEqual(page0.links[0].href);
                done();
            });

        httpBackend.flush();
    });

    it('should contain fetch errors on second page', function(done) {
        httpBackend.expectGET('/myreader/api/2/feeds/1/fetchError').respond(page1);

        service.findByFeedId(1)
            .then(function (data) {
                expect(data.fetchError).toEqual(page1.content);
                done();
            });

        httpBackend.flush();
    });

    it('should not contain next link on second page', function(done) {
        httpBackend.expectGET('/myreader/api/2/feeds/1/fetchError?page=1').respond(page1);

        service.findByLink(page0.links[0].href)
            .then(function (data) {
                expect(data.next()).toBeUndefined();
                done();
            });

        httpBackend.flush();
    });

    it('should set totalElements and retainDays', function(done) {
        httpBackend.expectGET('/myreader/api/2/feeds/1/fetchError').respond(page0);

        service.findByFeedId(1)
            .then(function (data) {
                expect(data.totalElements).toBe(2);
                expect(data.retainDays).toBe(7);
                done();
            });

        httpBackend.flush();
    });

    it('should set default values for totalElements and retainDays', function(done) {
        httpBackend.expectGET('/myreader/api/2/feeds/1/fetchError').respond(noElements);

        service.findByFeedId(1)
            .then(function (data) {
                expect(data.totalElements).toBe(0);
                expect(data.retainDays).toBe(0);
                done();
            });

        httpBackend.flush();
    });
});
