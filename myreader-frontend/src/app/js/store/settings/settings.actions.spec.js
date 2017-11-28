import {setPageSize, setShowEntryDetails, setShowUnseenEntries} from './settings';
import {loadSettings} from './settings.actions';

describe('src/app/js/store/settings/settings.actions.spec.js', () => {

    beforeEach(() => localStorage.clear());
    afterEach(() => localStorage.clear());

    it('should load settings from local storage', () => {
        setPageSize(5);
        setShowEntryDetails(false);
        setShowUnseenEntries(false);

        expect(loadSettings()).toEqual({
            type: 'SETTINGS_UPDATE',
            settings: {pageSize: 5, showUnseenEntries: false, showEntryDetails: false}
        });
    });

});
