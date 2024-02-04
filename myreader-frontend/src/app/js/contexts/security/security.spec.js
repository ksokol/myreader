import {getLastSecurityState, setLastSecurityState} from './security'

const key = 'myreader-security'

describe('security', () => {

  beforeEach(() => {
    window.location.hash = ''
  })

  it('should read last security state from storage', () => {
    localStorage.setItem(key, '{"a": "b", "passwordHash": "bogus"}')

    expect(getLastSecurityState()).toEqual({passwordHash: "bogus"})
  })

  it('should return default last security state from storage when state is not available', () => {
    expect(getLastSecurityState()).toEqual({passwordHash: null})
  })

  it('should write last security state to storage', () => {
    setLastSecurityState({passwordHash: null})

    expect(JSON.parse(localStorage.getItem(key))).toEqual({passwordHash: null})
  })
})
