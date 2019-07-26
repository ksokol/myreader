import {getLastSecurityState, setLastSecurityState} from './security'

const expectedRole = 'expected role'

describe('security', () => {

  beforeEach(() => {
    window.location.hash = ''
  })

  it('should read last security state from storage', () => {
    localStorage.setItem('myreader-security', `{"authorized": true, "roles": ["${expectedRole}"]}`)

    expect(getLastSecurityState()).toEqual({authorized: true, roles: [expectedRole]})
  })

  it('should return default last security state from storage when state is not available', () => {
    expect(getLastSecurityState()).toEqual({authorized: false, roles: []})
  })

  it('should write last security state to storage', () => {
    setLastSecurityState({authorized: true, roles: [expectedRole]})

    expect(JSON.parse(localStorage.getItem('myreader-security')))
      .toEqual({authorized: true, roles: [expectedRole]})
  })
})
