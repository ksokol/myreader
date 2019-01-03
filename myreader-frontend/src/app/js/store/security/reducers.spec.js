import {securityReducers} from './reducers'
import initialState from '.'

describe('security reducers', () => {

  let state

  beforeEach(() => {
    state = initialState()
    state.loginForm = {
      loginFailed: false
    }
  })

  describe('action SECURITY_UPDATE', () => {

    it('should set authorized and role', () => {
      const expected = {authorized: true, role: 'expected role'}

      expect(securityReducers(state, {type: 'SECURITY_UPDATE', ...expected}))
        .toContainObject(expected)
    })

    it('should set loginFailed to false when action.authorized is true', () => {
      const action = {authorized: true}
      state.loginFailed = true

      expect(securityReducers(state, {type: 'SECURITY_UPDATE', ...action}).loginForm)
        .toContainObject({loginFailed: false})
    })

    it('should set loginFailed to true when action.authorized is false', () => {
      const action = {authorized: false}

      expect(securityReducers(state, {type: 'SECURITY_UPDATE', ...action}).loginForm)
        .toContainObject({loginFailed: true})
    })

    it('should not set loginFailed to true when state.authorized is true', () => {
      const action = {authorized: false}
      state.authorized = true

      expect(securityReducers(state, {type: 'SECURITY_UPDATE', ...action}).loginForm)
        .toContainObject({loginFailed: false})
    })
  })

  describe('action LOGIN_START', () => {

    beforeEach(() => {
      state.loginForm = {
        loginPending: false,
        loginFailed: true
      }
    })

    it('should set loginForm.loginPending to true', () => {
      expect(securityReducers(state, {type: 'LOGIN_START'}).loginForm)
        .toContainObject({loginPending: true})
    })

    it('should set loginForm.loginFailed to false', () => {
      expect(securityReducers(state, {type: 'LOGIN_START'}).loginForm)
        .toContainObject({loginFailed: false})
    })
  })

  describe('action LOGIN_END', () => {

    it('should set loginForm.loginPending to false', () => {
      state.loginForm = {loginPending: true}

      expect(securityReducers(state, {type: 'LOGIN_END'}).loginForm).toEqual({loginPending: false})
    })
  })
})
