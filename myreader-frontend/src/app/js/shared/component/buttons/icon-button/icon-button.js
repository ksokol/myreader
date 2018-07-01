import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import {Icon} from '../../icon/icon'
import {noop} from '../../../utils'

const IconButton = props =>
  <button type="button"
          className={classNames('my-icon-button', props.className)}
          onClick={props.onClick}>
    <Icon type={props.type}
          color={props.color}/>
  </button>

IconButton.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  color: PropTypes.string,
  onClick: PropTypes.func
}

IconButton.defaultProps = {
  onClick: noop
}

export default IconButton
