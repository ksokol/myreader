import {authorized, unauthorized, updateSecurity, logout, tryLogin} from '../../store'
import {createMockStore} from '../../shared/test-utils'
import arrayMiddleware from '../middleware/array/arrayMiddleware'

describe('src/app/js/store/security/action.spec.js', () => {

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
            localStorage.setItem('myreader-security', '{"authorized": true, "role": "expected role"}')

            expect(updateSecurity()).toEqual({
                type: 'SECURITY_UPDATE',
                authorized: true,
                role: 'expected role'
            })
        })
    })

    describe('action creator unauthorized', () => {

        it('should persist last security state to local storage', () => {
            expect(unauthorized()[0]).toEqual({
                type: 'SECURITY_UPDATE',
                authorized: false,
                role: ''
            })

            expect(JSON.parse(localStorage.getItem('myreader-security'))).toEqual({
                authorized: false,
                role: ''
            })
        })

        it('should route to login page', () => {
            expect(unauthorized()[1]).toEqual({
                type: 'ROUTE_CHANGED',
                route: ['login'],
                query: {}
            })
        })
    })

    describe('action creator authorized', () => {

        it('should return SECURITY_UPDATE action with updated last security state', () => {
            expect(authorized({role: 'expected role'})).toEqual({
                type: 'SECURITY_UPDATE',
                authorized: true,
                role: 'expected role'
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

            expect(store.getActionTypes()).toEqual(['SECURITY_UPDATE', 'ROUTE_CHANGED'])
            expect(store.getActions()[0]).toContainActionData({authorized: false})
            expect(store.getActions()[1]).toContainActionData({route: ['login']})
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

        it('should dispatch action defined in success property', () => {
            store.dispatch(tryLogin({}))
            const success = store.getActions()[0].success
            store.clearActions()
            store.dispatch(success(null, {'x-my-authorities': 'ROLE_USER'}))

            expect(store.getActionTypes()).toEqual(['SECURITY_UPDATE'])
            expect(store.getActions()[0]).toContainActionData({authorized: true, role: 'ROLE_USER'})
        })
    })
})
