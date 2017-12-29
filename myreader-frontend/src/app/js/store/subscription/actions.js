import * as types from 'store/action-types'
import {toSubscriptions} from './subscription'
import {SUBSCRIPTIONS} from '../../constants'

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
        success: () => subscriptionDeleted(uuid)
    }
}
