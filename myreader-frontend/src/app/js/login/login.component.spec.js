import {mock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/login/login.component.spec.js', () => {

    let scope, element, httpBackend, $state, ngReduxMock

    beforeEach(angular.mock.module('myreader', mock('$state'), mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, _$httpBackend_, _$state_, $ngRedux) => {
        scope = $rootScope.$new()
        ngReduxMock = $ngRedux
        httpBackend = _$httpBackend_
        $state = _$state_
        $state.go = jasmine.createSpy('$state.go()')

        element = $compile('<my-login></my-login>')(scope)

        angular.element(element.find('input')[0]).val('email').triggerHandler('input')
        angular.element(element.find('input')[1]).val('password').triggerHandler('input')
        scope.$digest()
    }))

    afterEach(() => {
        httpBackend.verifyNoOutstandingExpectation()
        httpBackend.verifyNoOutstandingRequest()
    })

    it('should post credentials without remember me flag', () => {
        httpBackend.expectPOST('check', 'username=email&password=password&remember-me=undefined', headers =>
            headers['Content-Type'] === 'application/x-www-form-urlencoded'
        ).respond(200, '')

        element.find('button')[0].click()
        httpBackend.flush()
    })

    it('should post credentials with remember me flag', () => {
        httpBackend.expectPOST('check', 'username=email&password=password&remember-me=on', headers =>
            headers['Content-Type'] === 'application/x-www-form-urlencoded'
        ).respond(200, '')

        element.find('md-checkbox').triggerHandler('click')
        element.find('button')[0].click()
        httpBackend.flush()
    })

    it('should navigate to admin overview page when X-MY-AUTHORITIES header contains admin role', () => {
        httpBackend.whenPOST('check').respond(() => [200, undefined, {'X-MY-AUTHORITIES': 'ROLE_ADMIN'}])
        element.find('button')[0].click()
        httpBackend.flush()

        expect($state.go).toHaveBeenCalledWith('admin.overview')
        expect(ngReduxMock.getActions()[0]).toEqual({type: 'SECURITY_UPDATE', authorized: true, role: 'admin'})
    })

    it('should navigate to stream page when X-MY-AUTHORITIES header contains user role', () => {
        httpBackend.whenPOST('check').respond(200)
        element.find('button')[0].click()
        httpBackend.flush()

        expect($state.go).toHaveBeenCalledWith('app.entries')
        expect(ngReduxMock.getActions()[0]).toEqual({type: 'SECURITY_UPDATE', authorized: true, role: 'user'})
    })

    it('should navigate to stream page when X-MY-AUTHORITIES is not present', () => {
        httpBackend.whenPOST('check').respond(() => [200, undefined, {'X-MY-AUTHORITIES': 'ROLE_USER'}])
        element.find('button')[0].click()
        httpBackend.flush()

        expect($state.go).toHaveBeenCalledWith('app.entries')
        expect(ngReduxMock.getActions()[0]).toEqual({type: 'SECURITY_UPDATE', authorized: true, role: 'user'})
    })

    it('should indicate wrong credentials on page', () => {
        httpBackend.whenPOST('check').respond(404)
        element.find('button')[0].click()
        httpBackend.flush()

        expect(element.find('my-notification-panel').find('span')[0].innerText).toEqual('Username or password wrong')
    })

    it('should disable elements on page while post request is pending', () => {
        httpBackend.whenPOST('check').respond(404)
        element.find('button')[0].click()

        expect(element.find('button')[0].disabled).toBe(true)
        expect(element.find('input')[0].disabled).toBe(true)
        expect(element.find('input')[1].disabled).toBe(true)
        expect(element.find('md-checkbox')[0].disabled).toBe(true)
        httpBackend.flush()
    })

    it('should enable elements on page when post request finished', () => {
        httpBackend.whenPOST('check').respond(404)
        element.find('button')[0].click()

        httpBackend.flush()
        expect(element.find('button')[0].disabled).toBe(false)
        expect(element.find('input')[0].disabled).toBe(false)
        expect(element.find('input')[1].disabled).toBe(false)
        expect(element.find('md-checkbox')[0].disabled).toBe(false)
    })
})
