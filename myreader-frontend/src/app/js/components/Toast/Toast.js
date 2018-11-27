import './Toast.css'
import React from 'react'
import PropTypes from 'prop-types'
import * as ReactDom from 'react-dom'
import classNames from 'classnames'

const Toast = props => {
  const notifications = [...props.notifications].reverse().splice(0, 3)

  return notifications.length > 0 ? ReactDom.createPortal(
    <div className='my-toast'>
      {notifications.map(notification => {
        const classes = classNames(
          'my-toast__item',
          {'my-toast__item--error': notification.type === 'error'}
        )

        return (
          <div key={notification.id} className={classes}
               onClick={() => props.removeNotification(notification)}>
            {notification.text}
          </div>
        )
      })}
    </div>,
    document.body
  ) : null
}

Toast.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired
  )
}

Toast.defaultProps = {
  notifications: []
}

export default Toast
