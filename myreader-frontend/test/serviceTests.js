describe('test/serviceTests.js', function() {
    var service;

    beforeEach(angular.mock.module('common.services'));

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
