export const getNotifications = state => ({
  notifications: state.common.notification.notifications.map(it => ({...it}))
})

export const getNextNotificationId = state => state.common.notification.nextId

export const mediaBreakpointIsDesktopSelector = state => state.common.mediaBreakpoint === 'desktop'

export const pendingRequestCountSelector = state => state.common.pendingRequests
