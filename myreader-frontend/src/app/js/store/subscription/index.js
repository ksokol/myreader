export * from './actions'
export {subscriptionReducers} from './reducers'
export {getSubscriptions} from './selectors'

export const initialState = () => {
    return {
        subscriptions: []
    }
}
