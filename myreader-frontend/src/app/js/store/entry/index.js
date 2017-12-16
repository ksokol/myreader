export {entryPageReceived, entryUpdated, entryClear} from './actions'
export {entryReducers} from './reducers'
export {getEntries} from './selectors'

export const initialState = () => {
    return {
        links: {},
        entries: []
    }
}
