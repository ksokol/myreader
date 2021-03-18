import './EntryContent.css'
import React from 'react'
import PropTypes from 'prop-types'

export function EntryContent({content, visible}) {
  return visible ? (
    <div
      className='my-entry-content'
      dangerouslySetInnerHTML={{__html: content}}
    />
  ) : null
}

EntryContent.propTypes = {
  content: PropTypes.string,
  visible: PropTypes.bool
}
