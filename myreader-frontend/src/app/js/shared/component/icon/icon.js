import './icon.css'
import React from 'react'
import PropTypes from 'prop-types'

export const Icon = props => {
    const classNames = ['my-icon', `my-icon__${props.type}`, `my-icon--${props.color || 'grey'}`]
    return <span className={classNames.join(' ')}></span>
}

Icon.propTypes = {
    type: PropTypes.string.isRequired,
    color: PropTypes.string
}
