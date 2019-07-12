import * as types from '../../store/action-types'

export const subscriptionsReceived = subscriptions => {
  return {
    type: types.SUBSCRIPTIONS_RECEIVED,
    subscriptions
  }
}
