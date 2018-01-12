export {subscriptionReducers} from './reducers'
export * from './actions'
export * from './selectors'

export default function initialState() {
    return {
        subscriptions: [],
        tags: []
    }
}
