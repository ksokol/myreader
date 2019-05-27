import React from 'react'

const NotificationContext = React.createContext({
  showSuccessNotification: () => undefined,
  showErrorNotification: () => undefined,
})

export default NotificationContext
