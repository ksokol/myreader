import {mock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/login/login.component.spec.js', () => {

    let ngReduxMock, state

    beforeEach(angular.mock.module('myreader', mock('$state'), mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $state, $ngRedux) => {
        ngReduxMock = $ngRedux
        state = $state
        state.go = jasmine.createSpy('$state.go()')
    }))

    describe('', () => {

        let component

        beforeEach(inject($componentController =>
            component = $componentController('myLogin', {$ngRedux: ngReduxMock, $state: state})))

        it('should stay on login page when user is not authorized', () => {
            ngReduxMock.setState({security: {authorized: false}})
            component.$onInit()
            expect(state.go).not.toHaveBeenCalled()
        })

        it('should navigate to admin page when user is authorized and has admin role', () => {
            ngReduxMock.setState({security: {authorized: true, role: 'ROLE_USER'}})
            component.$onInit()
            expect(state.go).toHaveBeenCalledWith('app.entries')
        })

        it('should navigate to user page when user is authorized and has user role', () => {
            ngReduxMock.setState({security: {authorized: true, role: 'ROLE_ADMIN'}})
            component.$onInit()
            expect(state.go).toHaveBeenCalledWith('app.overview')
        })
    })

    describe('', () => {

        let scope, element

        beforeEach(inject(($rootScope, $compile) => {
            jasmine.clock().uninstall()

            scope = $rootScope.$new()

            element = $compile('<my-login></my-login>')(scope)

            angular.element(element.find('input')[0]).val('email').triggerHandler('input')
            angular.element(element.find('input')[1]).val('password').triggerHandler('input')
            scope.$digest()
        }))

        it('should post credentials without remember me flag', () => {
            element.find('button')[0].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['POST_LOGIN'])
            expect(ngReduxMock.getActions()[0].body.toString()).toEqual('username=email&password=password&remember-me=undefined')
        })

        it('should post credentials with remember me flag', () => {
            element.find('md-checkbox').triggerHandler('click')
            element.find('button')[0].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['POST_LOGIN'])
            expect(ngReduxMock.getActions()[0].body.toString()).toEqual('username=email&password=password&remember-me=on')
        })

        it('should indicate wrong credentials on page', done => {
            ngReduxMock.dispatch.and.returnValue(Promise.reject(null))
            element.find('button')[0].click()

            setTimeout(() => {
                scope.$digest()
                expect(element.find('my-notification-panel').find('span')[0].innerText).toEqual('Username or password wrong')
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
                expect(element.find('md-checkbox')[0].disabled).toBe(true)
                done()
            }, 0)
        })
    })
})
