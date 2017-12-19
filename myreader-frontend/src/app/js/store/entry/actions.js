import * as entryTypes from 'store/action-types'
import {toEntries, toEntry} from './entry'
import {getEntry, getEntryInFocus} from 'store'

export const entryPageReceived = raw => {
    return {type: entryTypes.ENTRY_PAGE_RECEIVED, ...toEntries(raw)}
}

export const entryChanged = entry => {
    return (dispatch, getState) => {
        if (entry && entry.uuid) {
            dispatch({type: entryTypes.ENTRY_CHANGED, newValue: toEntry(entry), oldValue: getEntry(entry.uuid, getState())})
        }
    }
}

export const entryClear = () => {
    return {type: entryTypes.ENTRY_CLEAR}
}

export const entryFocusNext = () => {
    return (dispatch, getState) => {
        dispatch({type: entryTypes.ENTRY_FOCUS_NEXT, currentInFocus: getEntryInFocus(getState())})
    }
}

export const entryFocusPrevious = () => {
    return (dispatch, getState) => {
        const currentInFocus = getEntryInFocus(getState())
        if (currentInFocus) {
            dispatch({type: entryTypes.ENTRY_FOCUS_PREVIOUS, currentInFocus})
        }
    }
}
