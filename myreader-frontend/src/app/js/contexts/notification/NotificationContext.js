import React from 'react'

const NotificationContext = React.createContext({
  showSuccessNotification: () => undefined,
  showErrorNotification: () => undefined,
})

/**
 * @deprecated
 */
export default NotificationContext
