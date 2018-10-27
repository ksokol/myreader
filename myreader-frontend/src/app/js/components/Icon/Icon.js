import React from 'react'
import PropTypes from 'prop-types'
import './icon-library'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Icon = ({type, inverse}) => <FontAwesomeIcon icon={type} inverse={inverse} fixedWidth />

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  inverse: PropTypes.bool
}

export default Icon
