import {getLastSecurityState, setLastSecurityState} from './security'

const key = 'myreader-security'
const expectedRole = 'expected role'

describe('security', () => {

  beforeEach(() => {
    window.location.hash = ''
  })

  it('should read last security state from storage', () => {
    localStorage.setItem(key, `{"a": "b", "roles": ["${expectedRole}"]}`)

    expect(getLastSecurityState()).toEqual({roles: [expectedRole]})
  })

  it('should return default last security state from storage when roles data is not of type array', () => {
    localStorage.setItem(key, '{"roles": "not an array"}')

    expect(getLastSecurityState()).toEqual({roles: []})
  })

  it('should return default last security state from storage when state is not available', () => {
    expect(getLastSecurityState()).toEqual({roles: []})
  })

  it('should write last security state to storage', () => {
    setLastSecurityState({roles: [expectedRole]})

    expect(JSON.parse(localStorage.getItem(key))).toEqual({roles: [expectedRole]})
  })
})
