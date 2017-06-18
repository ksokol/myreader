describe('src/app/js/maintenance/about/about.service.spec.js', function () {

    beforeEach(require('angular').mock.module('myreader'));

    var httpBackend;

    beforeEach(inject(function (aboutService, $httpBackend) {
        service = aboutService;
        httpBackend = $httpBackend;
    }));

    it('should fetch application build information', function(done) {
        httpBackend.expectGET('/myreader/info').respond({
            git: {
                commit: {
                    id: 'aec45'
                },
                branch: 'a-branch-name'
            },
            build: {
                version: '1.0',
                time: '2017-05-16T12:07:26Z'
            }
        });

        service.getProperties().then(function (response) {
            expect(response.branch).toEqual('a-branch-name');
            expect(response.commitId).toEqual('aec45');
            expect(response.version).toEqual('1.0');
            expect(response.buildTime).toEqual('2017-05-16T12:07:26Z');
            done();
        });

        httpBackend.flush();
    });
});

