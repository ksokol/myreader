import {getAuthorized} from 'store'

describe('src/app/js/store/security/selectors.spec.js', () => {

    it('should return false for authorized flag from state', () =>
        expect(getAuthorized({security: {authorized: false}})).toEqual(false))

    it('should return true for authorized flag from state', () =>
        expect(getAuthorized({security: {authorized: true}})).toEqual(true))
})
