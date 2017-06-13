describe('src/app/js/subscription/subscribe/subscribe.component.spec.js', function () {

    describe('with html', function () {

        var testUtils = require('../../shared/test-utils');

        var scope, element, $state, subscriptionService, deferred;

        beforeEach(require('angular').mock.module('myreader', testUtils.mock('$state'), testUtils.mock('subscriptionService')));

        beforeEach(inject(function ($rootScope, $compile, $q, _$state_, _subscriptionService_) {
            scope = $rootScope.$new();

            deferred = $q.defer();
            var promise = deferred.promise;
            subscriptionService = _subscriptionService_;
            subscriptionService.save = jasmine.createSpy('subscriptionService.save()');
            subscriptionService.save.and.returnValue(promise);

            $state = _$state_;
            $state.go = jasmine.createSpy('$state.go()');

            element = $compile('<my-subscribe></my-subscribe>')(scope);
            scope.$digest();
        }));

        it('should disable button when action is pending', function () {
            element.find('input').val('expected url').triggerHandler('input');
            element.find('button')[0].click();

            expect(element.find('button')[0].disabled).toEqual(true);
        });

        it('should enable button when action finished', function () {
            deferred.resolve({uuid: 'expected uuid'});
            element.find('input').val('expected url').triggerHandler('input');
            element.find('button')[0].click();

            expect(element.find('button')[0].disabled).toEqual(false);
        });

        it('should delegate to subscriptionService', function () {
            deferred.resolve({uuid: 'expected uuid'});
            element.find('input').val('expected url').triggerHandler('input');
            element.find('button')[0].click();

            expect(subscriptionService.save).toHaveBeenCalledWith({origin: 'expected url'});
        });

        it('should navigate user to detail page when action completed successfully', function () {
            deferred.resolve({uuid: 'expected uuid'});
            element.find('input').val('expected url').triggerHandler('input');
            element.find('button')[0].click();

            expect($state.go).toHaveBeenCalledWith('app.subscription', {uuid: 'expected uuid'});
        });

        it('should show notification message when action failed with HTTP 500', function () {
            deferred.reject({data: {status: 500, message: 'expected error'}});
            element.find('input').val('expected url').triggerHandler('input');
            element.find('button')[0].click();

            expect(element.find('my-notification-panel').find('span')[0].innerText)
                .toEqual('{"data":{"status":500,"message":"expected error"}}')
        });

        it('should show backend validation message', function () {
            deferred.reject({data: {status: 400, fieldErrors: [{field: 'origin', message: 'expected validation message'}]}});
            element.find('input').val('expected url').triggerHandler('input');
            element.find('button')[0].click();

            expect(element.find('my-validation-message').children().find('div')[0].innerText)
                .toEqual('expected validation message');
        });
    });
});
