import * as settingsTypes from './settings.action-types';

const initialState = {
    pageSize: 10,
    showUnseenEntries: true,
    showEntryDetails: true
};

export function settingsReducers(state = initialState, action) {
    switch (action.type) {
        case settingsTypes.UPDATE_SETTINGS: {
            return {...state, ...action.settings};
        }
        default: {
            return state;
        }
    }
}
