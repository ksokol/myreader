import './Badge.css'
import React from 'react'
import PropTypes from 'prop-types'

const Badge = props =>
  <div className='my-badge'>
    <span>{props.count}</span>
  </div>

Badge.propTypes = {
  count: PropTypes.number
}

Badge.defaultProps = {
  count: 0
}

export default Badge
