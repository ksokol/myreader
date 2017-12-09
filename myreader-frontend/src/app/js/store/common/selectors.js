export const getNotifications = state => {
    return {
        notifications: state.common.notification.notifications.map(it => {return {...it}})
    }
}

export const getNextNotificationId = getState => {
    return getState().common.notification.nextId
}

export const getPendingRequests = state => {
    return {
        pendingRequests: state.common.pendingRequests
    }
}
