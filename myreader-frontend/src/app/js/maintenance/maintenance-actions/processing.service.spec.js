describe('src/app/js/maintenance/maintenance-actions/processing.service.spec.js', function () {

    beforeEach(require('angular').mock.module('myreader'));

    var httpBackend;

    beforeEach(inject(function (processingService, $httpBackend) {
        service = processingService;
        httpBackend = $httpBackend;
    }));

    it('should put to processing resource', function(done) {
        httpBackend.expectPUT('/myreader/api/2/processing', {process: 'indexSyncJob'}).respond({});

        service.rebuildSearchIndex().then(function () {
            done();
        });

        httpBackend.flush();
    });
});

