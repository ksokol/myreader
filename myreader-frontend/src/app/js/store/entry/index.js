export {entryPageReceived, entryUpdated} from './actions'
export {entryReducers} from './reducers'

export const initialState = () => {
    return {
        links: {},
        entries: []
    }
}
