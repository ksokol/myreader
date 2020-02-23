import * as types from '../../store/action-types'
import {initialApplicationState} from '../../store'

export function commonReducers(state = initialApplicationState().common, action) {
  switch (action.type) {
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
  default: {
    return state
  }
  }
}
