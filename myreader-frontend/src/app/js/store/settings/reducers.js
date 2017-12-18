import * as types from 'store/action-types'

const initialState = {
    pageSize: 10,
    showUnseenEntries: true,
    showEntryDetails: true
}

export function settingsReducers(state = initialState, action) {
    switch (action.type) {
        case types.UPDATE_SETTINGS: {
            return {...state, ...action.settings}
        }
        default: {
            return state
        }
    }
}
