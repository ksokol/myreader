import {authorized, unauthorized, updateSecurity, logout} from 'store'

describe('src/app/js/store/security/action.spec.js', () => {

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
            expect(unauthorized()).toEqual({
                type: 'SECURITY_UPDATE',
                authorized: false,
                role: ''
            })

            expect(JSON.parse(localStorage.getItem('myreader-security'))).toEqual({
                authorized: false,
                role: ''
            })
        })

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
            expect(logout()).toEqualActionType('POST')
            expect(logout()).toContainActionData({url: 'logout'})
        })

        it('should call unauthorized action creator on success', () => {
            const success = logout().success()

            expect(success).toEqualActionType('SECURITY_UPDATE')
            expect(success).toContainActionData({authorized: false})
        })
    })
})
