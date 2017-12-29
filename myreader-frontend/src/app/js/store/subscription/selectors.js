import {cloneObject} from '../shared/objects'

export const getSubscriptions = state => {
    return {
        subscriptions: state.subscription.subscriptions.map(it => cloneObject(it))
    }
}
