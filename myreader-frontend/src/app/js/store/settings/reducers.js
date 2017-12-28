import * as types from 'store/action-types'
import initialState from '.'

export function settingsReducers(state = initialState(), action) {
    switch (action.type) {
        case types.UPDATE_SETTINGS: {
            return {...state, ...action.settings}
        }
        default: {
            return state
        }
    }
}
