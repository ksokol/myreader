import * as entryTypes from './action-types'
import {toEntries} from './entry'

export const entryPageReceived = raw => {
    return {type: entryTypes.ENTRY_PAGE_RECEIVED, ...toEntries(raw)}
}
