export * from './actions'
export {subscriptionReducers} from './reducers'

export const initialState = () => {
    return {
        subscriptions: []
    }
}
