import PropTypes from 'prop-types'
import React from 'react'

export const EntryContent = props => <div dangerouslySetInnerHTML={{__html: props.content}} />

EntryContent.propTypes = {
    content: PropTypes.string
}
