import React from 'react'
import PropTypes from 'prop-types'
import {Icon} from '../../icon/icon'

export const IconButton = props =>
    <button type="button" onClick={props.onClick} className="my-icon-button">
        <Icon type={props.type} color={props.color}></Icon>
    </button>

IconButton.propTypes = {
    type: PropTypes.string.isRequired,
    color: PropTypes.string,
    onClick: PropTypes.func
}
