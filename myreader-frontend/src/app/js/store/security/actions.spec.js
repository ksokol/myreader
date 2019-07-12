import {authorized, tryLogin, unauthorized, updateSecurity} from '../../store'
import {createMockStore} from '../../shared/test-utils'

describe('security actions', () => {

  let store

  beforeEach(() => {
    store = createMockStore()
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

  describe('action creator tryLogin', () => {

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

    it('should contain expected success and finalize callback functions', () => {
      const success = () => ({})
      const finalize = () => ({})
      store.dispatch(tryLogin({success, finalize}))

      expect(store.getActions()[0].success).toEqual(success)
      expect(store.getActions()[0].finalize).toEqual(finalize)
    })
  })
})
