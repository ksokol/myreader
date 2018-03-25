import {createSelector} from 'reselect'
import {settingsShowUnseenEntriesSelector} from 'store'
import {cloneObject} from '../shared/objects'

const subscriptionsSelector = state => state.subscription.subscriptions

const exclusionsSelector = state => state.subscription.exclusions

const subscriptionTagSelector = state => state.subscription.tags

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

export const subscriptionExclusionPatternsSelector = uuid => {
    return createSelector(
        exclusionsSelector,
        exclusions => (exclusions[uuid] || []).map(cloneObject)
    )
}

export const subscriptionByUuidSelector = uuid => {
    return createSelector(
        subscriptionsSelector,
        subscriptions => {
            return {
                subscription: cloneObject(subscriptions.find(it => it.uuid === uuid))
            }
        }
    )
}

export const subscriptionTagsSelector = createSelector(
    subscriptionTagSelector,
    tags => ({tags: [...tags.items]})
)

export const subscriptionTagsLoaded = createSelector(
    subscriptionTagSelector,
    tags => ({loaded: tags.loaded})
)
