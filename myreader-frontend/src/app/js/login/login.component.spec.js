import {mockNgRedux, reactComponent} from '../shared/test-utils'

describe('src/app/js/login/login.component.spec.js', () => {

  let ngReduxMock, loginPage

  beforeEach(() => {
    loginPage = reactComponent('LoginPage')
    angular.mock.module('myreader', mockNgRedux(), loginPage)
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

    let scope

    beforeEach(inject(($rootScope, $compile) => {
      jest.useRealTimers()

      scope = $rootScope.$new(true)

      $compile('<my-login></my-login>')(scope)[0]
      scope.$digest()
    }))

    xit('should post credentials', () => {
      ngReduxMock.dispatch.mockResolvedValue()
      loginPage.bindings.onLogin({username: 'expected-email', password: 'expected-password'})

      expect(ngReduxMock.getActionTypes()).toEqual(['POST_LOGIN'])
      expect(ngReduxMock.getActions()[0].body.toString()).toEqual('username=expected-email&password=expected-password')
    })

    it('should indicate wrong credentials on page', done => {
      ngReduxMock.dispatch.mockRejectedValueOnce()

      expect(loginPage.bindings.loginError).toBeUndefined()
      loginPage.bindings.onLogin({})

      setTimeout(() => {
        scope.$digest()
        expect(loginPage.bindings.loginError).toEqual(true)
        done()
      })
    })

    it('should disable elements on page while post request is pending', done => {
      ngReduxMock.dispatch.mockReturnValueOnce(new Promise(() => {}))

      expect(loginPage.bindings.disabled).toBeUndefined()
      loginPage.bindings.onLogin({})

      setTimeout(() => {
        scope.$digest()
        expect(loginPage.bindings.disabled).toEqual(true)
        done()
      })
    })
  })
})
