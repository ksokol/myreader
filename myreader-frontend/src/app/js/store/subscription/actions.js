import * as types from './action-types'
import {toSubscriptions} from './subscription'

export const subscriptionsReceived = raw => {
    return {type: types.SUBSCRIPTIONS_RECEIVED, ...toSubscriptions(raw)}
}
