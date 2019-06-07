import * as types from '../../store/action-types'
import {toBody, toSubscriptions} from './subscription'
import {SUBSCRIPTION_TAGS, SUBSCRIPTIONS} from '../../constants'
import {showSuccessNotification} from '../../store'

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

export const saveSubscriptionEditForm = ({subscription, success, error, finalize}) => {
  return {
    type: 'PATCH_SUBSCRIPTION',
    url: `${SUBSCRIPTIONS}/${subscription.uuid}`,
    body: toBody(subscription),
    success,
    error,
    finalize
  }
}

export const fetchSubscription = ({uuid, success}) => {
  return {
    type: 'GET_SUBSCRIPTION',
    url: `${SUBSCRIPTIONS}/${uuid}`,
    success
  }
}

export const saveSubscriptionTag = subscriptionTag => {
  return {
    type: 'PATCH_SUBSCRIPTION_TAG',
    url: `${SUBSCRIPTION_TAGS}/${subscriptionTag.uuid}`,
    body: subscriptionTag,
    success: response => [
      {
        type: types.SUBSCRIPTION_TAG_CHANGED,
        subscriptionTag: response
      },
      showSuccessNotification('Tag updated')
    ]
  }
}
