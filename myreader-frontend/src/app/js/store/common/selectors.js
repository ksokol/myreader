export const getNotifications = state => {
    return {
        notifications: state.common.notification.notifications.map(it => {return {...it}})
    }
}

export const getNextNotificationId = state => {
    return state.common.notification.nextId
}

export const getPendingRequests = state => {
    return {
        pendingRequests: state.common.pendingRequests
    }
}

export const mediaBreakpointIsDesktopSelector = state => state.common.mediaBreakpoint === 'desktop'

export const sidenavSlideIn = state => state.common.sidenavSlideIn

export const backdropIsVisible = state => state.common.backdropVisible
