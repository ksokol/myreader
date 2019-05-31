export const getNotifications = state => ({
  notifications: state.common.notification.notifications.map(it => ({...it}))
})

export const getNextNotificationId = state => state.common.notification.nextId

export const mediaBreakpointIsDesktopSelector = state => state.common.mediaBreakpoint === 'desktop'

export const sidenavSlideIn = state => state.common.sidenavSlideIn

export const backdropIsVisible = state => state.common.backdropVisible

export const pendingRequestCountSelector = state => state.common.pendingRequests
