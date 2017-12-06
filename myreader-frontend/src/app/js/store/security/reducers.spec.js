import {securityReducers} from './reducers';

describe('src/app/js/store/security/reducers.spec.js', () => {

    const state = {
        '__previous': 'state'
    };

    it('should update security', () => {
        const expected = {
            authorized: true,
            role: 'expected role',
        };

        expect(securityReducers(state, {type: 'SECURITY_UPDATE', ...expected})).toEqual({...state, ...expected});
    });
});
