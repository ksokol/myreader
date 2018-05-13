import {mockNgRedux} from '../../shared/test-utils'

describe('src/app/js/subscription/subscribe/subscribe.component.spec.js', () => {

    let scope, element, ngReduxMock

    beforeEach(angular.mock.module('myreader', mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new(true)
        ngReduxMock = $ngRedux

        element = $compile('<my-subscribe></my-subscribe>')(scope)[0]
        scope.$digest()
    }))

    it('should disable button when action is pending', done => {
        jest.useRealTimers()
        ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))

        element.querySelector('button').click()

        setTimeout(() => {
            scope.$digest()
            expect(element.querySelector('button').disabled).toEqual(true)
            done()
        })
    })

    it('should enable button when action finished', done => {
        jest.useRealTimers()
        ngReduxMock.dispatch.mockResolvedValueOnce({uuid: 'expected uuid'})

        element.querySelector('input').value = 'expected url'
        element.querySelector('input').dispatchEvent(new Event('input'))
        element.querySelector('button').click()

        setTimeout(() => {
            scope.$digest()
            expect(element.querySelector('button').disabled).toEqual(false)
            done()
        })
    })

    it('should dispatch save subscription action with given url', done => {
        jest.useRealTimers()

        ngReduxMock.dispatch.mockImplementationOnce(action => {
            expect(action).toEqualActionType('POST_SUBSCRIPTION')
            expect(action).toContainActionData({body: {origin: 'expected url'}})
            done()
            return new Promise(() => {})
        })

        element.querySelector('input').value = 'expected url'
        element.querySelector('input').dispatchEvent(new Event('input'))
        element.querySelector('button').click()
    })

    it('should navigate user to detail page when action completed successfully', done => {
        jest.useRealTimers()
        ngReduxMock.dispatch.mockResolvedValueOnce({uuid: 'expected uuid'})
        element.querySelector('input').value = 'expected url'
        element.querySelector('input').dispatchEvent(new Event('input'))
        element.querySelector('button').click()
        ngReduxMock.dispatch.mockClear()

        setTimeout(() => {
            scope.$digest()
            const action = ngReduxMock.dispatch.mock.calls[0][0]
            expect(action).toContainObject({type: 'ROUTE_CHANGED', route: ['app', 'subscription'], query: {uuid: 'expected uuid'}})
            done()
        })
    })

    it('should show backend validation message', done => {
        jest.useRealTimers()
        ngReduxMock.dispatch.mockRejectedValueOnce({
            status: 400,
            data: {fieldErrors: [
                    {field: 'origin', message: 'expected validation message'}
                ]
            }
        })

        element.querySelector('input').value = 'expected url'
        element.querySelector('input').dispatchEvent(new Event('input'))
        element.querySelector('button').click()

        setTimeout(() => {
            scope.$digest()
            expect(element.querySelector('my-validation-message > div > div').textContent).toEqual('expected validation message')
            done()
        })
    })

    it('should not show validation message when request failed', done => {
        jest.useRealTimers()
        ngReduxMock.dispatch.mockRejectedValueOnce({status: 500})

        element.querySelector('input').value = 'expected url'
        element.querySelector('input').dispatchEvent(new Event('input'))
        element.querySelector('button').click()

        setTimeout(() => {
            scope.$digest()
            expect(element.querySelector('my-validation-message > div > div')).toBeNull()
            done()
        })
    })
})
