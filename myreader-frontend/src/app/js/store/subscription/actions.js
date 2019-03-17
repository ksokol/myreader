import * as types from '../../store/action-types'
import {toBody, toExclusionPattern, toExclusionPatterns, toSubscription, toSubscriptions} from './subscription'
import {EXCLUSION_TAGS, SUBSCRIPTION_TAGS, SUBSCRIPTIONS} from '../../constants'
import {routeChange, showSuccessNotification, subscriptionByUuidSelector} from '../../store'
import {subscriptionRoute, subscriptionsRoute} from '../../../../routes'

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

export const subscriptionDeleted = uuid => {
  return {
    type: types.SUBSCRIPTION_DELETED,
    uuid
  }
}

const subscriptionEditFormChanging = () => {
  return {
    type: types.SUBSCRIPTION_EDIT_FORM_CHANGING
  }
}

const subscriptionEditFormChanged = () => {
  return {
    type: types.SUBSCRIPTION_EDIT_FORM_CHANGED
  }
}

export const deleteSubscription = uuid => {
  return {
    type: 'DELETE_SUBSCRIPTION',
    url: `${SUBSCRIPTIONS}/${uuid}`,
    before: subscriptionEditFormChanging,
    success: [
      () => showSuccessNotification('Subscription deleted'),
      () => subscriptionDeleted(uuid),
      () => routeChange(subscriptionsRoute())
    ],
    finalize: subscriptionEditFormChanged
  }
}

export const subscriptionEditFormSaved = raw => {
  return {
    type: types.SUBSCRIPTION_EDIT_FORM_SAVED,
    data: toSubscription(raw)
  }
}

export const saveSubscriptionEditForm = subscription => {
  return {
    type: 'PATCH_SUBSCRIPTION',
    url: `${SUBSCRIPTIONS}/${subscription.uuid}`,
    body: toBody(subscription),
    before: [
      subscriptionEditFormChanging,
      () => subscriptionEditFormValidations([])
    ],
    success: [
      () => showSuccessNotification('Subscription saved'),
      response => subscriptionEditFormSaved(response)
    ],
    error: error => {
      if (error.status === 400) {
        return subscriptionEditFormValidations(error.fieldErrors)
      }
    },
    finalize: subscriptionEditFormChanged
  }
}

export const saveSubscribeEditForm = subscription => {
  return {
    type: 'POST_SUBSCRIPTION',
    url: SUBSCRIPTIONS,
    body: toBody(subscription),
    before: [
      subscriptionEditFormChanging,
      () => subscriptionEditFormValidations([])
    ],
    success: [
      () => showSuccessNotification('Subscribed'),
      ({uuid}) => routeChange(subscriptionRoute({uuid}))
    ],
    error: error => {
      if (error.status === 400) {
        return subscriptionEditFormValidations(error.fieldErrors)
      }
    },
    finalize: subscriptionEditFormChanged
  }
}

export const subscriptionExclusionPatternsReceived = (subscriptionUuid, raw) => {
  return {
    type: types.SUBSCRIPTION_EXCLUSION_PATTERNS_RECEIVED,
    subscriptionUuid,
    patterns: toExclusionPatterns(raw)
  }
}

export const fetchSubscriptionExclusionPatterns = uuid => {
  return {
    type: 'GET_SUBSCRIPTION_EXCLUSION_PATTERNS',
    url: `${EXCLUSION_TAGS}/${uuid}/pattern`,
    success: response => subscriptionExclusionPatternsReceived(uuid, response)
  }
}

export const subscriptionExclusionPatternsAdded = (subscriptionUuid, raw) => {
  return {
    type: types.SUBSCRIPTION_EXCLUSION_PATTERNS_ADDED,
    subscriptionUuid,
    pattern: toExclusionPattern(raw)
  }
}

export const addSubscriptionExclusionPattern = (subscriptionUuid, pattern) => {
  return {
    type: 'POST_SUBSCRIPTION_EXCLUSION_PATTERN',
    url: `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern`,
    body: {pattern},
    before: subscriptionEditFormChanging,
    success: response => subscriptionExclusionPatternsAdded(subscriptionUuid, response),
    finalize: subscriptionEditFormChanged
  }
}

export const subscriptionExclusionPatternsRemoved = (subscriptionUuid, uuid) => {
  return {
    type: types.SUBSCRIPTION_EXCLUSION_PATTERNS_REMOVED,
    subscriptionUuid,
    uuid
  }
}

export const removeSubscriptionExclusionPattern = (subscriptionUuid, uuid) => {
  return {
    type: 'DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS',
    url: `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern/${uuid}`,
    before: subscriptionEditFormChanging,
    success: () => subscriptionExclusionPatternsRemoved(subscriptionUuid, uuid),
    finalize: subscriptionEditFormChanged
  }
}

export const clearSubscriptionEditForm = () => {
  return {
    type: types.SUBSCRIPTION_EDIT_FORM_CLEAR
  }
}

const loadSubscriptionEditForm = subscription => {
  return {
    type: types.SUBSCRIPTION_EDIT_FORM_LOAD,
    subscription
  }
}

export const loadSubscriptionIntoEditForm = uuid => {
  return (dispatch, getState) => {
    const {subscription} = subscriptionByUuidSelector(uuid)(getState())
    return subscription ?
      dispatch(loadSubscriptionEditForm(subscription)) :
      dispatch({
        type: 'GET_SUBSCRIPTION',
        url: `${SUBSCRIPTIONS}/${uuid}`,
        success: response => dispatch(loadSubscriptionEditForm(toSubscription(response)))
      })
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

const subscriptionEditFormValidations = validations => {
  return {
    type: types.SUBSCRIPTION_EDIT_FORM_VALIDATIONS,
    validations
  }
}

export const subscriptionEditFormChangeData = data => {
  return {
    type: types.SUBSCRIPTION_EDIT_FORM_CHANGE_DATA,
    data
  }
}
