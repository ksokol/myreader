export {entryPageReceived, entryChanged, entryClear, entryFocusNext, entryFocusPrevious} from './actions'
export {entryReducers} from './reducers'
export {getEntries, getEntryInFocus, getNextFocusableEntry} from './selectors'
export {ENTRY_CHANGED} from './action-types'

export const initialState = () => {
    return {
        links: {},
        entries: [],
        entryInFocus: null
    }
}
