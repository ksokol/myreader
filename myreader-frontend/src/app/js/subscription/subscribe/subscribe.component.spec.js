import {mock, mockNgRedux} from '../../shared/test-utils'

describe('src/app/js/subscription/subscribe/subscribe.component.spec.js', () => {

    let scope, element, state, ngReduxMock

    beforeEach(angular.mock.module('myreader', mock('$state'), mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $state, $ngRedux) => {
        jasmine.clock().uninstall()

        scope = $rootScope.$new()
        ngReduxMock = $ngRedux
        state = $state
        state.go = jasmine.createSpy('$state.go()')

        element = $compile('<my-subscribe></my-subscribe>')(scope)
        scope.$digest()
    }))

    it('should disable button when action is pending', done => {
        ngReduxMock.dispatch.and.returnValue(new Promise(() => {}))
        element.find('button')[0].click()

        setTimeout(() => {
            scope.$digest()
            expect(element.find('button')[0].disabled).toEqual(true)
            done()
        }, 0)

    })

    it('should enable button when action finished', done => {
        ngReduxMock.dispatch.and.returnValue(Promise.resolve({uuid: 'expected uuid'}))
        element.find('input').val('expected url').triggerHandler('input')
        element.find('button')[0].click()

        setTimeout(() => {
            scope.$digest()
            expect(element.find('button')[0].disabled).toEqual(false)
            done()
        }, 0)
    })

    it('should dispatch save subscription action with given url', done => {
        ngReduxMock.dispatch.and.callFake(action => {
            expect(action).toEqualActionType('POST_SUBSCRIPTION')
            expect(action).toContainActionData({body: {origin: 'expected url'}})
            done()
            return new Promise(() => {})
        })

        element.find('input').val('expected url').triggerHandler('input')
        element.find('button')[0].click()
    })

    it('should navigate user to detail page when action completed successfully', done => {
        ngReduxMock.dispatch.and.returnValue(Promise.resolve({uuid: 'expected uuid'}))
        element.find('input').val('expected url').triggerHandler('input')
        element.find('button')[0].click()

        setTimeout(() => {
            scope.$digest()
            expect(state.go).toHaveBeenCalledWith('app.subscription', {uuid: 'expected uuid'})
            done()
        }, 0)
    })

    it('should show backend validation message', done => {
        ngReduxMock.dispatch.and.returnValue(Promise.reject({status: 400, data: {fieldErrors: [{field: 'origin', message: 'expected validation message'}]}}))
        element.find('input').val('expected url').triggerHandler('input')
        element.find('button')[0].click()

        setTimeout(() => {
            scope.$digest()
            expect(element.find('my-validation-message').children().find('div')[0].innerText).toEqual('expected validation message')
            done()
        }, 0)
    })

    it('should not show validation message when request failed', done => {
        ngReduxMock.dispatch.and.returnValue(Promise.reject({status: 500}))
        element.find('input').val('expected url').triggerHandler('input')
        element.find('button')[0].click()

        setTimeout(() => {
            scope.$digest()
            expect(element.find('my-validation-message').children().find('div')[0]).toBeUndefined()
            done()
        }, 0)
    })
})
