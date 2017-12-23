import * as types from 'store/action-types'
import {toEntries, toEntry} from './entry'
import {getEntry, getEntryInFocus, getSettings} from 'store'
import {ENTRY_AVAILABLE_TAGS, SUBSCRIPTION_ENTRIES} from '../../constants'
import {toUrlString} from '../shared/links'

export const entryPageReceived = raw => {
    return {type: types.ENTRY_PAGE_RECEIVED, ...toEntries(raw)}
}

export const entryChanged = entry => {
    return (dispatch, getState) => {
        if (entry && entry.uuid) {
            dispatch({type: types.ENTRY_CHANGED, newValue: toEntry(entry), oldValue: getEntry(entry.uuid, getState())})
        }
    }
}

export const entryClear = () => {
    return {type: types.ENTRY_CLEAR}
}

export const entryFocusNext = () => {
    return (dispatch, getState) => {
        dispatch({type: types.ENTRY_FOCUS_NEXT, currentInFocus: getEntryInFocus(getState()).uuid})
    }
}

export const entryFocusPrevious = () => {
    return (dispatch, getState) => {
        const currentInFocus = getEntryInFocus(getState()).uuid
        if (currentInFocus) {
            dispatch({type: types.ENTRY_FOCUS_PREVIOUS, currentInFocus})
        }
    }
}

export const fetchEntries = link => {
    return (dispatch, getState) => {
        const settings = getSettings(getState())

        link.query['size'] = link.query['size'] || settings.pageSize
        link.query['seenEqual'] = link.query['seenEqual'] === undefined ? settings.showUnseenEntries === true ? false : '*' : link.query['seenEqual']

        dispatch({
            type: 'GET',
            url: toUrlString(link),
            success: response => entryPageReceived(response)
        })
    }
}

export const changeEntry = ({uuid, seen, tag}) => {
    return dispatch => {
        if (!uuid) {
            return
        }

        dispatch({
            type: 'PATCH',
            url: `${SUBSCRIPTION_ENTRIES}/${uuid}`,
            body: {seen, tag},
            success: response => entryChanged(response)
        })
    }
}

export const entryTagsReceived = raw => {
    return {type: types.ENTRY_TAGS_RECEIVED, tags: [...raw]}
}

export const fetchEntryTags = () => {
    return {
        type: 'GET',
        url: ENTRY_AVAILABLE_TAGS,
        success: response => entryTagsReceived(response)
    }
}
