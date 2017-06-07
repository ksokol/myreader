describe('src/app/js/subscription/subscription-tag-panel/subscription-tag.service.spec.js', function () {

    var httpBackend;

    beforeEach(require('angular').mock.module('myreader'));

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
