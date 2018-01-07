import {getAuthorized, adminPermissionSelector} from 'store'

describe('src/app/js/store/security/selectors.spec.js', () => {

    it('should return false for authorized flag from state', () =>
        expect(getAuthorized({security: {authorized: false}})).toEqual(false))

    it('should return true for authorized flag from state', () =>
        expect(getAuthorized({security: {authorized: true}})).toEqual(true))

    it('adminPermissionSelector should return false when role is set to value "user"', () =>
        expect(adminPermissionSelector({security: {role: 'user'}})).toEqual(false))

    it('adminPermissionSelector should return true when role is set to value "admin"', () =>
        expect(adminPermissionSelector({security: {role: 'admin'}})).toEqual(true))
})
