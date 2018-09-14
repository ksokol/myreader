import './EntryContent.css'
import React from 'react'
import PropTypes from 'prop-types'

export const EntryContent = props => <div className="my-entry-content" dangerouslySetInnerHTML={{__html: props.content}}/>

EntryContent.propTypes = {
  content: PropTypes.string
}
