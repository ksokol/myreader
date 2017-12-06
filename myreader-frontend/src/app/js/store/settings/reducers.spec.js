import {settingsReducers} from './reducers';

describe('src/app/js/store/settings/reducers.spec.js', () => {

    const state = {
        '__previous': 'state'
    };

    it('should update settings', () => {
        const action = {
            type: 'SETTINGS_UPDATE',
            settings: {
                expected1: 'settings1',
                expected2: 'settings2',
            }
        };

        expect(settingsReducers(state, action)).toEqual({...state, ...action.settings});
    });
});
