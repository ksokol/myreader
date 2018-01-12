import * as types from 'store/action-types'
import {toSubscriptions} from './subscription'
import {SUBSCRIPTION_AVAILABLE_TAGS, SUBSCRIPTIONS} from '../../constants'
import {showSuccessNotification} from 'store'

export const subscriptionsReceived = raw => {
    return {type: types.SUBSCRIPTIONS_RECEIVED, ...toSubscriptions(raw)}
}

export const fetchSubscriptions = () => {
    return {
        type: 'GET_SUBSCRIPTIONS',
        url: SUBSCRIPTIONS,
        success: response => subscriptionsReceived(response)
    }
}

export const subscriptionDeleted = uuid => {
    return {type: types.SUBSCRIPTION_DELETED, uuid}
}

export const deleteSubscription = uuid => {
    return {
        type: 'DELETE_SUBSCRIPTION',
        url : `${SUBSCRIPTIONS}/${uuid}`,
        success: [
            () => showSuccessNotification('Subscription deleted'),
            () => subscriptionDeleted(uuid)
        ]
    }
}

export const subscriptionSaved = raw => {
    return {type: types.SUBSCRIPTION_SAVED, subscription: {...raw}}
}

export const saveSubscription = subscription => {
    return {
        type: subscription.uuid ? 'PATCH_SUBSCRIPTION' : 'POST_SUBSCRIPTION',
        url : subscription.uuid ? `${SUBSCRIPTIONS}/${subscription.uuid}` : SUBSCRIPTIONS,
        body: subscription,
        success: [
            () => showSuccessNotification('Subscription saved'),
            response => subscriptionSaved(response)
        ]
    }
}

export const subscriptionTagsReceived = raw => {
    return {type: types.SUBSCRIPTION_TAGS_RECEIVED, tags: [...raw]}
}

export const fetchSubscriptionTags = () => {
    return {
        type: 'GET_SUBSCRIPTION_TAGS',
        url : SUBSCRIPTION_AVAILABLE_TAGS,
        success: response => subscriptionTagsReceived(response)
    }
}
