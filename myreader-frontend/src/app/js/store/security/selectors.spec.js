import {getSecurity} from './selectors';

describe('src/app/js/store/security/reducers.spec.js', () => {

    it('should return security state from selector', () => {
        expect(getSecurity(() => {return {security: 'expected state'}})).toEqual('expected state');
    });
});
