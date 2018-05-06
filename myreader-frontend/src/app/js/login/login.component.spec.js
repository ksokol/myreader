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
            jasmine.clock().uninstall()

            scope = $rootScope.$new(true)

            element = $compile('<my-login></my-login>')(scope)

            angular.element(element.find('input')[0]).val('email').triggerHandler('input')
            angular.element(element.find('input')[1]).val('password').triggerHandler('input')
            scope.$digest()
        }))

        it('should post credentials', () => {
            element.find('button')[0].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['POST_LOGIN'])
            expect(ngReduxMock.getActions()[0].body.toString()).toEqual('username=email&password=password')
        })

        it('should indicate wrong credentials on page', done => {
            ngReduxMock.dispatch.and.returnValue(Promise.reject(null))
            element.find('button')[0].click()

            setTimeout(() => {
                scope.$digest()
                expect(element.find('span')[0].innerText).toEqual('Username or password wrong')
                done()
            }, 0)
        })

        it('should disable elements on page while post request is pending', done => {
            ngReduxMock.dispatch.and.returnValue(new Promise(() => {}))
            element.find('button')[0].click()

            setTimeout(() => {
                scope.$digest()
                expect(element.find('button')[0].disabled).toBe(true)
                expect(element.find('input')[0].disabled).toBe(true)
                expect(element.find('input')[1].disabled).toBe(true)
                done()
            }, 0)
        })
    })
})
