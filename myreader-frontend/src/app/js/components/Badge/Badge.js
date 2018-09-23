import './Badge.css'
import React from 'react'
import PropTypes from 'prop-types'

const Badge = props =>
  <div className='my-badge'>
    <span>{props.text}</span>
  </div>

Badge.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default Badge
