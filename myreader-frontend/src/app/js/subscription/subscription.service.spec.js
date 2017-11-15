describe('src/app/js/subscription/subscription.service.spec.js', () => {

    let httpBackend, service;

    beforeEach(angular.mock.module('myreader'));

    beforeEach(inject(($httpBackend, subscriptionService) => {
        httpBackend = $httpBackend;
        service = subscriptionService;
    }));

    it('should return expected body', done => {
        httpBackend.expectGET('/myreader/api/2/subscriptions').respond({content: 'expected'});

        service.findAll()
            .then(data => {
                expect(data).toEqual('expected');
                done();
            });

        httpBackend.flush();
    });

    it('should return expected body', done => {
        httpBackend.expectGET('/myreader/api/2/subscriptions/subscriptionUuid').respond('expected');

        service.find('subscriptionUuid')
            .then(data => {
                expect(data).toEqual('expected');
                done();
            });

        httpBackend.flush();
    });

    it('should post subscription when uuid is missing', done => {
        const subscription = {tag: 'tag'};

        httpBackend.expectPOST('/myreader/api/2/subscriptions', subscription).respond('expected');

        service.save(subscription)
            .then(data => {
                expect(data).toEqual('expected');
                done();
            });

        httpBackend.flush();
    });

    it('should convert empty tag to null', done => {
        httpBackend.expectPOST('/myreader/api/2/subscriptions', {tag: null}).respond('expected');

        service.save({tag: ''})
            .then(data => {
                expect(data).toEqual('expected');
                done();
            });

        httpBackend.flush();
    });

    it('should patch existing subscription when uuid exists', done => {
        const subscription = {uuid: '1'};

        httpBackend.expectPATCH('/myreader/api/2/subscriptions/1', subscription).respond('expected');

        service.save(subscription)
            .then(data => {
                expect(data).toEqual('expected');
                done();
            });

        httpBackend.flush();
    });

    it('should delete subscription', done => {
        httpBackend.expectDELETE('/myreader/api/2/subscriptions/1').respond();

        service.remove('1').then(() => done());

        httpBackend.flush();
    });
});
