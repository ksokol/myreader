import * as types from '../../store/action-types'
import {cloneObject} from '../shared/objects'
import {initialApplicationState} from '../../store'

function subscriptionsReceived({state, action}) {
  return {
    ...state,
    subscriptions: action.subscriptions
  }
}

function subscriptionChanged({state, action}) {
  const {newValue, oldValue} = action
  const subscriptions = state.subscriptions.map(it => {
    const clone = cloneObject(it)
    if (clone.uuid === newValue.feedUuid && newValue.seen !== oldValue.seen) {
      clone.unseen = newValue.seen ? clone.unseen - 1 : clone.unseen + 1
    }
    return clone
  })
  return {
    ...state,
    subscriptions
  }
}

function securityUpdate({state, action}) {
  return action.authorized ? state : initialApplicationState().subscription
}

export function subscriptionReducers(state = initialApplicationState().subscription, action) {
  switch (action.type) {
  case types.SUBSCRIPTIONS_RECEIVED: {
    return subscriptionsReceived({state, action})
  }
  case types.ENTRY_CHANGED: {
    return subscriptionChanged({state, action})
  }
  case types.SECURITY_UPDATE: {
    return securityUpdate({state, action})
  }
  default: {
    return state
  }
  }
}
