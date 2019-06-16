import * as types from '../../store/action-types'
import {initialApplicationState} from '../../store'

function mediaBreakpointChanged({state, action}) {
  return {
    ...state,
    mediaBreakpoint:
    action.mediaBreakpoint
  }
}

export function commonReducers(state = initialApplicationState().common, action) {
  switch (action.type) {
    case types.FETCH_START: {
      return {...state, pendingRequests: state.pendingRequests + 1}
    }
    case types.FETCH_END: {
      return {...state, pendingRequests: state.pendingRequests - 1}
    }
    case types.SHOW_NOTIFICATION: {
      const nextId = state.notification.nextId + 1
      const notifications = [...state.notification.notifications, action.notification]
      return {...state, notification: {nextId, notifications}}
    }
    case types.REMOVE_NOTIFICATION: {
      const nextId = state.notification.nextId
      const notifications = state.notification.notifications.filter(it => it.id !== action.id)
      return {...state, notification: {nextId, notifications}}
    }
    case types.MEDIA_BREAKPOINT_CHANGED: {
      return mediaBreakpointChanged({state, action})
    }
    default: {
      return state
    }
  }
}
