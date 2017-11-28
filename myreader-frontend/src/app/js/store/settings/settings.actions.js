import * as settingsTypes from './settings.action-types';
import {getPageSize, isShowEntryDetails, isShowUnseenEntries} from './settings';

export const loadSettings = () => {
    const settings = {
        pageSize: getPageSize(),
        showUnseenEntries: isShowUnseenEntries(),
        showEntryDetails: isShowEntryDetails()
    };
    return {type: settingsTypes.UPDATE_SETTINGS, settings};
};
