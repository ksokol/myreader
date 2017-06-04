describe('src/app/js/subscription/subscription-exclusion-panel/subscription-exclusion/exclusion.service.spec.js', function() {

    var httpBackend;

    beforeEach(require('angular').mock.module('myreader'));

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
            .respond('expected');

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
