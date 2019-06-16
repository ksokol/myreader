export const getNotifications = state => ({
  notifications: state.common.notification.notifications.map(it => ({...it}))
})

export const getNextNotificationId = state => state.common.notification.nextId

export const pendingRequestCountSelector = state => state.common.pendingRequests
