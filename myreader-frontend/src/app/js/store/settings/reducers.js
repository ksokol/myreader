import * as types from 'store/action-types'
import {initialApplicationState} from 'store'

export function settingsReducers(state = initialApplicationState().settings, action) {
    switch (action.type) {
        case types.UPDATE_SETTINGS: {
            return {...state, ...action.settings}
        }
        default: {
            return state
        }
    }
}
