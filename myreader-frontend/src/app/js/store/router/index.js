export * from './actions'
export * from './selectors'
export {routerReducers} from './reducers'

export default function initialState() {
    return {
        currentRoute: [],
        query: {}
    }
}
