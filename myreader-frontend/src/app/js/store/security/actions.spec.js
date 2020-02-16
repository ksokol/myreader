import {updateSecurity} from '../../store'

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
})
