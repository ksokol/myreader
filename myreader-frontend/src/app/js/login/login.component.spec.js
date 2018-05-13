import {mockNgRedux} from '../shared/test-utils'

describe('src/app/js/login/login.component.spec.js', () => {

    let ngReduxMock

    beforeEach(angular.mock.module('myreader', mockNgRedux()))

    beforeEach(inject($ngRedux => ngReduxMock = $ngRedux))

    describe('', () => {

        let component

        beforeEach(inject($componentController =>
            component = $componentController('myLogin', {$ngRedux: ngReduxMock})))

        it('should stay on login page when user is not authorized', () => {
            ngReduxMock.setState({security: {authorized: false}})
            component.$onInit()
            expect(ngReduxMock.getActionTypes()).toEqual([])
        })

        it('should navigate to admin page when user is authorized and has admin role', () => {
            ngReduxMock.setState({security: {authorized: true, role: 'ROLE_USER'}})
            component.$onInit()
            expect(ngReduxMock.getActions()).toContainObject([{type: 'ROUTE_CHANGED', route: ['app', 'entries']}])
        })

        it('should navigate to user page when user is authorized and has user role', () => {
            ngReduxMock.setState({security: {authorized: true, role: 'ROLE_ADMIN'}})
            component.$onInit()

            expect(ngReduxMock.getActions()).toContainObject([{type: 'ROUTE_CHANGED', route: ['admin', 'overview']}])
        })
    })

    describe('', () => {

        let scope, element

        beforeEach(inject(($rootScope, $compile) => {
            jest.useRealTimers()

            scope = $rootScope.$new(true)

            element = $compile('<my-login></my-login>')(scope)[0]

            element.querySelectorAll('input')[0].value = 'email'
            element.querySelectorAll('input')[0].dispatchEvent(new Event('input'))

            element.querySelectorAll('input')[1].value = 'password'
            element.querySelectorAll('input')[1].dispatchEvent(new Event('input'))

            scope.$digest()
        }))

        it('should post credentials', () => {
            element.querySelector('button').click()

            expect(ngReduxMock.getActionTypes()).toEqual(['POST_LOGIN'])
            expect(ngReduxMock.getActions()[0].body.toString()).toEqual('username=email&password=password')
        })

        it('should indicate wrong credentials on page', done => {
            ngReduxMock.dispatch.mockRejectedValueOnce()
            element.querySelector('button').click()

            setTimeout(() => {
                scope.$digest()
                expect(element.querySelector('span').textContent).toEqual('Username or password wrong')
                done()
            })
        })

        it('should disable elements on page while post request is pending', done => {
            ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))
            element.querySelector('button').click()

            setTimeout(() => {
                scope.$digest()
                expect(element.querySelector('button').disabled).toBe(true)
                expect(element.querySelectorAll('input')[0].disabled).toBe(true)
                expect(element.querySelectorAll('input')[1].disabled).toBe(true)
                done()
            })
        })
    })
})
