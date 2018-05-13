import * as types from '../../store/action-types'
import {initialApplicationState} from '../../store'

function hideBackdrop({state}) {
    let backdropVisible = !state.backdropVisible
    let sidenavSlideIn = backdropVisible
    return {...state, sidenavSlideIn, backdropVisible}
}

function toggleSidenav({state}) {
    return state.mediaBreakpoint === 'desktop' ?
        state :
        {...state, sidenavSlideIn: !state.sidenavSlideIn, backdropVisible: !state.backdropVisible}
}

function mediaBreakpointChanged({state, action}) {
    let backdropVisible = state.backdropVisible
    let sidenavSlideIn = state.sidenavSlideIn
    if (action.mediaBreakpoint === 'desktop') {
        backdropVisible = false
        sidenavSlideIn = false
    }
    return {...state, mediaBreakpoint: action.mediaBreakpoint, sidenavSlideIn, backdropVisible}
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
        case types.HIDE_BACKDROP: {
            return hideBackdrop({state})
        }
        case types.TOGGLE_SIDENAV: {
            return toggleSidenav({state})
        }
        case types.MEDIA_BREAKPOINT_CHANGED: {
            return mediaBreakpointChanged({state, action})
        }
        default: {
            return state
        }
    }
}
