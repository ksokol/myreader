import {createSelector} from 'reselect'
import {cloneObject} from '../shared/objects'

const subscriptionSelector = state => state.subscription

export const getSubscriptions = createSelector(
    subscriptionSelector,
    subscription => {
        return {
            subscriptions: subscription.subscriptions.map(it => cloneObject(it))
        }
    }
)
