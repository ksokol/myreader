import * as types from './action-types'
import {toSubscriptions} from './subscription'
import {SUBSCRIPTIONS} from '../../constants'

export const subscriptionsReceived = raw => {
    return {type: types.SUBSCRIPTIONS_RECEIVED, ...toSubscriptions(raw)}
}

export const fetchSubscriptions = (unseen = true) => {
    const url =  unseen ? `${SUBSCRIPTIONS}?unseenGreaterThan=0` : SUBSCRIPTIONS;

    return {
        type: 'GET', url,
        success: response => subscriptionsReceived(response)
    }
}
