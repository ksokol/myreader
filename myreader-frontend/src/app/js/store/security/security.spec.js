import {getLastSecurityState, setLastSecurityState} from './security';

describe('src/app/js/store/security/security.spec.js', () => {

    beforeEach(() => localStorage.clear());
    afterEach(() => localStorage.clear());

    it('should read last security state from storage', () => {
        localStorage.setItem('myreader-security', '{"authorized": true, "role": "expected role"}');

        expect(getLastSecurityState()).toEqual({
            authorized: true,
            role: 'expected role'
        });
    });

    it('', () => {
        localStorage.setItem('myreader-security', '{"authorized": false, "role": ""}');

        expect(getLastSecurityState()).toEqual({
            authorized: false,
            role: ''
        });
    });

    it('should return default last security state from storage when state is not available', () => {
        expect(getLastSecurityState()).toEqual({
            authorized: false,
            role: ''
        });
    });

    it('should write last security state to storage', () => {
        setLastSecurityState({authorized: true, role: 'expected role'});

        expect(JSON.parse(localStorage.getItem('myreader-security'))).toEqual({
            authorized: true,
            role: 'expected role'
        });
    });
});
