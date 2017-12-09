import {setPageSize, setShowEntryDetails, setShowUnseenEntries} from './settings';
import {loadSettings, updateSettings} from './actions';

describe('src/app/js/store/settings/actions.spec.js', () => {

    it('should return SETTINGS_UPDATE action with settings from local storage', () => {
        setPageSize(5);
        setShowEntryDetails(false);
        setShowUnseenEntries(false);

        expect(loadSettings()).toEqual({
            type: 'SETTINGS_UPDATE',
            settings: {pageSize: 5, showUnseenEntries: false, showEntryDetails: false}
        });
    });

    it('should persist settings to local storage', () => {
        const settings = {
            pageSize: 5,
            showUnseenEntries: false,
            showEntryDetails: false
        };
        updateSettings(settings);

        expect(JSON.parse(localStorage.getItem('myreader-settings'))).toEqual(settings);
    });

    it('should return SETTINGS_UPDATE action with updated settings', () => {
        const settings = {
            pageSize: 5,
            showUnseenEntries: false,
            showEntryDetails: false
        };

        expect(updateSettings(settings)).toEqual({
            type: 'SETTINGS_UPDATE',
            settings: {pageSize: 5, showUnseenEntries: false, showEntryDetails: false}
        });
    });
});
