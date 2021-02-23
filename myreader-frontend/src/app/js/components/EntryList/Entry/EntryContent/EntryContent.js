import './EntryContent.css'
import React from 'react'
import PropTypes from 'prop-types'
import {useSettings} from '../../../../contexts/settings'

export function EntryContent({content, maybeVisible}) {
  const {showEntryDetails} = useSettings()

  return showEntryDetails || maybeVisible ? (
    <div
      className='my-entry-content'
      dangerouslySetInnerHTML={{__html: content}}
    />
  ) : null
}

EntryContent.propTypes = {
  content: PropTypes.string,
  maybeVisible: PropTypes.bool
}
