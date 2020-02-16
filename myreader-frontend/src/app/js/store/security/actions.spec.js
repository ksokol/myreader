import {unauthorized, updateSecurity} from '../../store'

describe('security actions', () => {

  beforeEach(() => {
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
})
