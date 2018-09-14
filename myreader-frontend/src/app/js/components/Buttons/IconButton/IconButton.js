import './IconButton.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {Icon} from '../..'
import {noop} from '../../../shared/utils'

const IconButton = props =>
  <button type="button"
          className={classNames('my-icon-button', props.className)}
          disabled={props.disabled}
          onClick={props.onClick}>
    <Icon type={props.type}
          color={props.color}
          disabled={props.disabled}/>
  </button>

IconButton.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}

IconButton.defaultProps = {
  disabled: false,
  onClick: noop
}

export default IconButton
