import * as settingsTypes from './settings.action-types';
import {
    getPageSize, isShowEntryDetails, isShowUnseenEntries, setPageSize, setShowEntryDetails,
    setShowUnseenEntries
} from './settings';

export const updateSettings = ({pageSize, showEntryDetails, showUnseenEntries}) => {
    setPageSize(pageSize);
    setShowEntryDetails(showEntryDetails);
    setShowUnseenEntries(showUnseenEntries);

    return loadSettings();
};

export const loadSettings = () => {
    const settings = {
        pageSize: getPageSize(),
        showUnseenEntries: isShowUnseenEntries(),
        showEntryDetails: isShowEntryDetails()
    };
    return {type: settingsTypes.UPDATE_SETTINGS, settings};
};
