import {getLastSecurityState, setLastSecurityState} from './security'

const key = 'myreader-security'

describe('security', () => {

  beforeEach(() => {
    window.location.hash = ''
  })

  it('should read last security state from storage', () => {
    localStorage.setItem(key, '{"a": "b", "authorized": true}')

    expect(getLastSecurityState()).toEqual({authorized: true})
  })

  it('should return default last security state from storage when roles data is not of type array', () => {
    localStorage.setItem(key, '{"authorized": "not a boolean"}')

    expect(getLastSecurityState()).toEqual({authorized: false})
  })

  it('should return default last security state from storage when state is not available', () => {
    expect(getLastSecurityState()).toEqual({authorized: false})
  })

  it('should write last security state to storage', () => {
    setLastSecurityState({authorized: false})

    expect(JSON.parse(localStorage.getItem(key))).toEqual({authorized: false})
  })
})
