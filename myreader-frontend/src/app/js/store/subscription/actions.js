import * as types from '../../store/action-types'
import {toBody, toExclusionPattern, toExclusionPatterns, toSubscriptions} from './subscription'
import {EXCLUSION_TAGS, SUBSCRIPTION_TAGS, SUBSCRIPTIONS} from '../../constants'
import {routeChange, showSuccessNotification} from '../../store'
import {subscriptionRoute} from '../../routes'

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

export const deleteSubscription = ({uuid, success, finalize}) => {
  return {
    type: 'DELETE_SUBSCRIPTION',
    url: `${SUBSCRIPTIONS}/${uuid}`,
    success,
    finalize
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
    success: response => subscriptionExclusionPatternsAdded(subscriptionUuid, response)
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
    success: () => subscriptionExclusionPatternsRemoved(subscriptionUuid, uuid)
  }
}

export const clearSubscriptionEditForm = () => {
  return {
    type: types.SUBSCRIPTION_EDIT_FORM_CLEAR
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
