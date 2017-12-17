import {cloneObject} from '../shared/objects'

export const getSubscriptions = getState => {
    return getState().subscription.subscriptions.map(it => cloneObject(it))
}
