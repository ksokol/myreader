import * as types from './action-types'
import {initialState} from './index'

export function commonReducers(state = initialState(), action) {
    switch (action.type) {
        case types.FETCH_START: {
            return {...state, pendingRequests: ++state.pendingRequests}
        }
        case types.FETCH_END: {
            return {...state, pendingRequests: --state.pendingRequests}
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
        default: {
            return state
        }
    }
}
