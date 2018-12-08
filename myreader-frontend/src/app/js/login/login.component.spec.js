import {mockNgRedux, reactComponent} from '../shared/test-utils'

describe('src/app/js/login/login.component.spec.js', () => {

  let scope, ngReduxMock, loginPage

  beforeEach(() => {
    loginPage = reactComponent('LoginPage')
    angular.mock.module('myreader', mockNgRedux(), loginPage)
  })

  beforeEach(inject($ngRedux => ngReduxMock = $ngRedux))

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
