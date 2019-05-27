import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {showSuccessNotification, showErrorNotification} from '../../store'
import NotificationContext from './NotificationContext'

class NotificationProvider extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.any
  }

  api = {
    showSuccessNotification: message => this.props.dispatch(showSuccessNotification(message)),
    showErrorNotification: message => this.props.dispatch(showErrorNotification(message))
  }

  render() {
    return (
      <NotificationContext.Provider value={this.api}>
        {this.props.children}
      </NotificationContext.Provider>
    )
  }
}

export default connect()(NotificationProvider)
