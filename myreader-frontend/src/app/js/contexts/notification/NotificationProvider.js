import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {showSuccessNotification} from '../../store'
import NotificationContext from './NotificationContext'

class NotificationProvider extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.any
  }

  showSuccessNotification = message => this.props.dispatch(showSuccessNotification(message))

  render() {
    return (
      <NotificationContext.Provider value={{
        showSuccessNotification: this.showSuccessNotification
      }}>
        {this.props.children}
      </NotificationContext.Provider>
    )
  }
}

export default connect()(NotificationProvider)
