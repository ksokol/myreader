import React from 'react'
import {connect} from 'react-redux'
import {getNotifications, removeNotification} from '../../store'
import {Toast} from '../../components'

const mapStateToProps = getNotifications

const mapDispatchToProps = dispatch => ({
  removeNotification: notification => dispatch(removeNotification(notification))
})

const ToastContainer = props => <Toast {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToastContainer)
