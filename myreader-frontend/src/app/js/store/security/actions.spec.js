import {authorized, logout, tryLogin, unauthorized, updateSecurity} from '../../store'
import {createMockStore} from '../../shared/test-utils'
import arrayMiddleware from '../middleware/array/arrayMiddleware'

describe('security actions', () => {

  let store

  beforeEach(() => {
    store = createMockStore([arrayMiddleware])
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('action creator updateSecurity', () => {

    it('should return last security state from local storage', () => {
      localStorage.setItem('myreader-security', '{"roles": ["expected role"]}')

      expect(updateSecurity()).toEqual({
        type: 'SECURITY_UPDATE',
        authorized: true,
        roles: ['expected role']
      })
    })
  })

  describe('action creator unauthorized', () => {

    it('should persist last security state to local storage', () => {
      expect(unauthorized()).toEqual({
        type: 'SECURITY_UPDATE',
        authorized: false,
        roles: []
      })

      expect(JSON.parse(localStorage.getItem('myreader-security'))).toEqual({
        roles: []
      })
    })
  })

  describe('action creator authorized', () => {

    it('should return SECURITY_UPDATE action with updated last security state', () => {
      expect(authorized({roles: ['expected role']})).toEqual({
        type: 'SECURITY_UPDATE',
        authorized: true,
        roles: ['expected role']
      })
    })
  })

  describe('action creator logout', () => {

    it('should create expected action', () => {
      expect(logout()).toEqualActionType('POST_LOGOUT')
      expect(logout()).toContainActionData({url: 'logout'})
    })

    it('should contain expected success actions', () => {
      store.dispatch(logout().success())

      expect(store.getActionTypes()).toEqual(['SECURITY_UPDATE'])
      expect(store.getActions()[0]).toContainActionData({roles: []})
    })
  })

  describe('action creator tryLogin', () => {

    it('should dispatch action defined in before property', () => {
      store.dispatch(tryLogin({}).before())

      expect(store.getActionTypes()).toEqual(['LOGIN_START'])
    })

    it('should contain expected action type', () => {
      store.dispatch(tryLogin({}))

      expect(store.getActionTypes()).toEqual(['POST_LOGIN'])
    })

    it('should contain expected action data', () => {
      store.dispatch(tryLogin({username: 'a', password: 'b'}))

      expect(store.getActions()[0])
        .toContainActionData({url: 'check', headers: {'content-type': 'application/x-www-form-urlencoded'}})
      expect(store.getActions()[0].body.toString()).toEqual('username=a&password=b')
    })

    it('should dispatch action defined in success property (USER)', () => {
      store.dispatch(tryLogin({}))
      const success = store.getActions()[0].success
      store.clearActions()
      store.dispatch(success(null, {'x-my-authorities': 'USER'}))

      expect(store.getActionTypes()).toEqual(['SECURITY_UPDATE', 'ROUTE_CHANGED'])
      expect(store.getActions()[0]).toContainActionData({roles: ['USER']})
      expect(store.getActions()[1]).toContainActionData({route: ['app', 'entries']})
    })

    it('should dispatch action defined in success property (ADMIN)', () => {
      store.dispatch(tryLogin({}))
      const success = store.getActions()[0].success
      store.clearActions()
      store.dispatch(success(null, {'x-my-authorities': 'ADMIN'}))

      expect(store.getActionTypes()).toEqual(['SECURITY_UPDATE', 'ROUTE_CHANGED'])
      expect(store.getActions()[0]).toContainActionData({roles: ['ADMIN']})
      expect(store.getActions()[1]).toContainActionData({route: ['admin', 'overview']})
    })

    it('should dispatch action defined in finalize property', () => {
      store.dispatch(tryLogin({}).finalize())

      expect(store.getActionTypes()).toEqual(['LOGIN_END'])
    })
  })
})
