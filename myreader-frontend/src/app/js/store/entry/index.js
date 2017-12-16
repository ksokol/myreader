export {entryPageReceived} from './actions'
export {entryReducers} from './reducers'

export const initialState = () => {
    return {
        links: {},
        entries: []
    }
}
