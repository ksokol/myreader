import {mockNgRedux, reactComponent} from '../shared/test-utils'

describe('src/app/js/login/login.component.spec.js', () => {

  let ngReduxMock, emailInput, passwordInput

  beforeEach(() => {
    emailInput = reactComponent('LoginEmailInput')
    passwordInput = reactComponent('LoginPasswordInput')
    angular.mock.module('myreader', mockNgRedux(), emailInput, passwordInput)
  })

  beforeEach(inject($ngRedux => ngReduxMock = $ngRedux))

  describe('', () => {

    let component

    beforeEach(inject($componentController => {
      component = $componentController('myLogin', {$ngRedux: ngReduxMock})
    }))

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
      scope.$digest()

      emailInput.bindings.onChange('expected-email')
      passwordInput.bindings.onChange('expected-password')
    }))

    it('should pass expected props to email input component', () => {
      expect(emailInput.bindings).toContainObject({
        type: 'email',
        name: 'username',
        label: 'Email',
        value: 'expected-email',
        autoComplete: 'email'
      })
    })

    it('should pass expected props to password input component', () => {
      expect(passwordInput.bindings).toContainObject({
        type: 'password',
        name: 'password',
        label: 'Password',
        value: 'expected-password',
        autoComplete: 'current-password'
      })
    })

    it('should post credentials', () => {
      element.querySelector('button').click()

      expect(ngReduxMock.getActionTypes()).toEqual(['POST_LOGIN'])
      expect(ngReduxMock.getActions()[0].body.toString()).toEqual('username=expected-email&password=expected-password')
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
        expect(emailInput.bindings.disabled).toEqual(true)
        expect(passwordInput.bindings.disabled).toEqual(true)
        done()
      })
    })
  })
})
