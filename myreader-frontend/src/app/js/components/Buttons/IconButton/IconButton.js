import './IconButton.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Icon} from '../../Icon/Icon'
import {noop} from '../../../shared/utils'

const IconButton = props =>
  <button type='button'
    className={`my-icon-button ${props.className || ''}`}
    role={props.role || props.type}
    disabled={props.disabled}
    onClick={props.onClick}>
    <Icon
      type={props.type}
      inverse={props.inverse}
    />
  </button>

IconButton.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  role: PropTypes.string,
  disabled: PropTypes.bool,
  inverse: PropTypes.bool,
  onClick: PropTypes.func
}

IconButton.defaultProps = {
  disabled: false,
  onClick: noop
}

export default IconButton
