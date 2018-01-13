import * as types from 'store/action-types'
import {toSubscriptions, toExclusionPatterns} from './subscription'
import {SUBSCRIPTION_AVAILABLE_TAGS, SUBSCRIPTIONS, EXCLUSION_TAGS} from '../../constants'
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

export const subscriptionExclusionPatternsReceived = (subscriptionUuid, raw) => {
    return {type: types.SUBSCRIPTION_EXCLUSION_PATTERNS_RECEIVED, subscriptionUuid, patterns: toExclusionPatterns(raw)}
}

export const fetchSubscriptionExclusionPatterns = uuid => {
    return {
        type: 'GET_SUBSCRIPTION_EXCLUSION_PATTERNS',
        url : `${EXCLUSION_TAGS}/${uuid}/pattern`,
        success: response => subscriptionExclusionPatternsReceived(uuid, response)
    }
}

export const subscriptionExclusionPatternsRemoved = (subscriptionUuid, uuid) => {
    return {type: types.SUBSCRIPTION_EXCLUSION_PATTERNS_REMOVED, subscriptionUuid, uuid}
}

export const removeSubscriptionExclusionPattern = (subscriptionUuid, uuid) => {
    return {
        type: 'DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS',
        url : `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern/${uuid}`,
        success: response => subscriptionExclusionPatternsRemoved(subscriptionUuid, uuid, response)
    }
}
