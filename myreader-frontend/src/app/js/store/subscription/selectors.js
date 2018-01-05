import {createSelector} from 'reselect'
import {settingsShowUnseenEntriesSelector} from 'store'
import {cloneObject} from '../shared/objects'

const subscriptionsSelector = state => {
    return state.subscription.subscriptions
}

export const getSubscriptions = createSelector(
    subscriptionsSelector,
    subscriptions => {
        return {
            subscriptions: subscriptions.map(it => cloneObject(it))
        }
    }
)

export const filteredByUnseenSubscriptionsSelector = createSelector(
    subscriptionsSelector,
    settingsShowUnseenEntriesSelector,
    (subscriptions, showUnseenEntries) => {
        return {
            subscriptions: subscriptions
                .filter(it => showUnseenEntries ? it.unseen > 0 : true)
                .map(it => cloneObject(it))
        }
    }
)
