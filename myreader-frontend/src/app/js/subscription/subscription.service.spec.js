describe('src/app/js/subscription/subscription.service.spec.js', () => {

    let httpBackend, service

    beforeEach(angular.mock.module('myreader'))

    beforeEach(inject(($httpBackend, subscriptionService) => {
        httpBackend = $httpBackend
        service = subscriptionService
    }))

    it('should return expected body', done => {
        httpBackend.expectGET('/myreader/api/2/subscriptions/subscriptionUuid').respond('expected')

        service.find('subscriptionUuid')
            .then(data => {
                expect(data).toEqual('expected')
                done()
            })

        httpBackend.flush()
    })
})
