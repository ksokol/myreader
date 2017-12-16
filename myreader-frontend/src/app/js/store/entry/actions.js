import * as entryTypes from './action-types'
import {toEntries, toEntry} from './entry'

export const entryPageReceived = raw => {
    return {type: entryTypes.ENTRY_PAGE_RECEIVED, ...toEntries(raw)}
}

export const entryUpdated = raw => {
    return {type: entryTypes.ENTRY_UPDATED, entry: toEntry(raw)}
}

export const entryClear = () => {
    return {type: entryTypes.ENTRY_CLEAR}
}
