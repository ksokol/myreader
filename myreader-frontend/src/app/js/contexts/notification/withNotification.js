import React from 'react'
import {NotificationContext} from '../../contexts'

export const withNotification = Component => {

  return class WithNotification extends React.Component {

    static contextType = NotificationContext

    render() {
      return (
        <Component
          {...this.props}
          showSuccessNotification={this.context.showSuccessNotification}
          showErrorNotification={this.context.showErrorNotification}
        />
      )
    }
  }
}
