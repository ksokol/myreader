import React from 'react'
import PropTypes from 'prop-types'
import {Icon} from '../../icon/icon'

export const IconButton = props => <button type="button" className="my-icon-button"><Icon {...props}></Icon></button>

Icon.propTypes = {
    type: PropTypes.string.isRequired,
    color: PropTypes.string
}
