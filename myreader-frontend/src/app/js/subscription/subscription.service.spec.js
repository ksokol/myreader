describe('src/app/js/subscription/subscription.service.spec.js', function () {

    var httpBackend;

    beforeEach(require('angular').mock.module('myreader'));

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
