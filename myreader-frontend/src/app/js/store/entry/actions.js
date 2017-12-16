import * as entryTypes from './action-types'
import {toEntries, toEntry} from './entry'
import {getEntryInFocus} from './selectors'

export const entryPageReceived = raw => {
    return {type: entryTypes.ENTRY_PAGE_RECEIVED, ...toEntries(raw)}
}

export const entryUpdated = raw => {
    return {type: entryTypes.ENTRY_UPDATED, entry: toEntry(raw)}
}

export const entryClear = () => {
    return {type: entryTypes.ENTRY_CLEAR}
}

export const entryFocusNext = () => {
    return (dispatch, getState) => {
        dispatch({type: entryTypes.ENTRY_FOCUS_NEXT, currentInFocus: getEntryInFocus(getState)})
    }
}

export const entryFocusPrevious = () => {
    return (dispatch, getState) => {
        const currentInFocus = getEntryInFocus(getState)
        if (currentInFocus) {
            dispatch({type: entryTypes.ENTRY_FOCUS_PREVIOUS, currentInFocus})
        }
    }
}
