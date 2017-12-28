import {mock, mockNgRedux} from '../../shared/test-utils'

describe('src/app/js/subscription/subscribe/subscribe.component.spec.js', () => {

    let scope, element, $state, ngReduxMock, subscriptionService, deferred

    beforeEach(angular.mock.module('myreader', mock('$state'), mock('subscriptionService'), mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $q, _$state_, $ngRedux, _subscriptionService_) => {
        scope = $rootScope.$new()
        ngReduxMock = $ngRedux

        deferred = $q.defer()
        const promise = deferred.promise
        subscriptionService = _subscriptionService_
        subscriptionService.save = jasmine.createSpy('subscriptionService.save()')
        subscriptionService.save.and.returnValue(promise)

        $state = _$state_
        $state.go = jasmine.createSpy('$state.go()')

        element = $compile('<my-subscribe></my-subscribe>')(scope)
        scope.$digest()
    }))

    it('should disable button when action is pending', function () {
        element.find('input').val('expected url').triggerHandler('input')
        element.find('button')[0].click()

        expect(element.find('button')[0].disabled).toEqual(true)
    })

    it('should enable button when action finished', function () {
        deferred.resolve({uuid: 'expected uuid'})
        element.find('input').val('expected url').triggerHandler('input')
        element.find('button')[0].click()

        expect(element.find('button')[0].disabled).toEqual(false)
    })

    it('should delegate to subscriptionService', function () {
        deferred.resolve({uuid: 'expected uuid'})
        element.find('input').val('expected url').triggerHandler('input')
        element.find('button')[0].click()

        expect(subscriptionService.save).toHaveBeenCalledWith({origin: 'expected url'})
    })

    it('should navigate user to detail page when action completed successfully', function () {
        deferred.resolve({uuid: 'expected uuid'})
        element.find('input').val('expected url').triggerHandler('input')
        element.find('button')[0].click()

        expect($state.go).toHaveBeenCalledWith('app.subscription', {uuid: 'expected uuid'})
    })

    it('should show notification message when action failed with HTTP 500', function () {
        deferred.reject({data: {status: 500, message: 'expected error'}})
        element.find('input').val('expected url').triggerHandler('input')
        element.find('button')[0].click()

        expect(ngReduxMock.getActionTypes()).toEqual(['SHOW_NOTIFICATION'])
        expect(ngReduxMock.getActions()[0]).toContainActionData({notification: {text: {data: {status: 500, message: 'expected error'}}, type: 'error'}})
    })

    it('should show backend validation message', function () {
        deferred.reject({data: {status: 400, fieldErrors: [{field: 'origin', message: 'expected validation message'}]}})
        element.find('input').val('expected url').triggerHandler('input')
        element.find('button')[0].click()

        expect(element.find('my-validation-message').children().find('div')[0].innerText)
            .toEqual('expected validation message')
    })
})
