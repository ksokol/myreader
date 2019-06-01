import * as types from '../../store/action-types'
import {initialApplicationState} from '../../store'

function securityUpdate({state, action}) {
  return action.authorized ? state : initialApplicationState().admin
}

function feedDeleted({state, action}) {
  const feeds = state.feeds.filter(it => it.uuid !== action.uuid)
  return {
    ...state,
    feeds
  }
}

function feedsReceived({state, action}) {
  return {
    ...state,
    feeds: action.feeds
  }
}

export function adminReducers(state = initialApplicationState().admin, action) {
  switch (action.type) {
  case types.FEEDS_RECEIVED: {
    return feedsReceived({state, action})
  }
  case types.FEED_DELETED: {
    return feedDeleted({state, action})
  }
  case types.SECURITY_UPDATE: {
    return securityUpdate({state, action})
  }
  default: {
    return state
  }
  }
}
