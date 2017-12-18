import {authorized, unauthorized, updateSecurity} from 'store'

describe('src/app/js/store/security/action.spec.js', () => {

    it('should return SECURITY_UPDATE action with last security state from local storage', () => {
        localStorage.setItem('myreader-security', '{"authorized": true, "role": "expected role"}')

        expect(updateSecurity()).toEqual({
            type: 'SECURITY_UPDATE',
            authorized: true,
            role: 'expected role'
        })
    })

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
