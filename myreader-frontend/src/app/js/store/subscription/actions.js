import * as types from '../../store/action-types'
import {toSubscriptions} from './subscription'
import {SUBSCRIPTIONS} from '../../constants'

export const subscriptionsReceived = raw => {
  return {
    type: types.SUBSCRIPTIONS_RECEIVED,
    subscriptions: toSubscriptions(raw)
  }
}

export const fetchSubscriptions = () => {
  return {
    type: 'GET_SUBSCRIPTIONS',
    url: SUBSCRIPTIONS,
    success: response => subscriptionsReceived(response)
  }
}

export const fetchSubscription = ({uuid, success}) => {
  return {
    type: 'GET_SUBSCRIPTION',
    url: `${SUBSCRIPTIONS}/${uuid}`,
    success
  }
}
