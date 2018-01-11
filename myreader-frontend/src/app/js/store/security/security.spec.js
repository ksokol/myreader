import {getLastSecurityState, installAuthorizationChangeActionDispatcher, setLastSecurityState} from './security'
import {createMockStore} from '../../shared/test-utils'

describe('src/app/js/store/security/security.spec.js', () => {

    let store

    beforeEach(() => {
        window.location.hash = ''
        store = createMockStore()
    })

    it('should read last security state from storage', () => {
        localStorage.setItem('myreader-security', '{"authorized": true, "role": "expected role"}')

        expect(getLastSecurityState()).toEqual({authorized: true, role: 'expected role'})
    })

    it('should return default last security state from storage when state is not available', () => {
        expect(getLastSecurityState()).toEqual({authorized: false, role: ''})
    })

    it('should write last security state to storage', () => {
        setLastSecurityState({authorized: true, role: 'expected role'})

        expect(JSON.parse(localStorage.getItem('myreader-security'))).toEqual({authorized: true, role: 'expected role'})
    })

    it('should subscribe to state changes and should redirect to login page when session expired', () => {
        installAuthorizationChangeActionDispatcher(store)
        store.setState({security: {authorized: false}})
        store.dispatch({type: 'DUMMY'})

        expect(window.location.hash).toEqual('#/login')
    })

    it('should subscribe to state changes and should not redirect to login page when session valid', () => {
        installAuthorizationChangeActionDispatcher(store)
        store.setState({security: {authorized: true}})
        store.dispatch({type: 'DUMMY'})

        expect(window.location.hash).toEqual('')
    })
})
