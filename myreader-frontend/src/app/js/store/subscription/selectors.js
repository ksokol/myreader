import {cloneObject} from '../shared/objects'

export const getSubscriptions = state => {
    return state.subscription.subscriptions.map(it => cloneObject(it))
}
