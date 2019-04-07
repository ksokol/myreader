import {getLastSecurityState, setLastSecurityState} from './security'
import {createMockStore} from '../../shared/test-utils'

describe('security', () => {

  let store

  beforeEach(() => {
    window.location.hash = ''
    store = createMockStore()
  })

  it('should read last security state from storage', () => {
    localStorage.setItem('myreader-security', '{"authorized": true, "roles": ["expected role"]}')

    expect(getLastSecurityState()).toEqual({authorized: true, roles: ['expected role']})
  })

  it('should return default last security state from storage when state is not available', () => {
    expect(getLastSecurityState()).toEqual({authorized: false, roles: []})
  })

  it('should write last security state to storage', () => {
    setLastSecurityState({authorized: true, roles: ['expected role']})

    expect(JSON.parse(localStorage.getItem('myreader-security')))
      .toEqual({authorized: true, roles: ['expected role']})
  })
})
