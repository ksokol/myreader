import './EntryContent.css'
import React from 'react'
import PropTypes from 'prop-types'
import {useAppContext} from '../../../../contexts'

export const EntryContent = ({content: __html, maybeVisible}) => {
  const {
    mediaBreakpoint,
    showEntryDetails
  } = useAppContext()

  const isVisible = mediaBreakpoint === 'desktop' ? showEntryDetails || maybeVisible : maybeVisible

  return isVisible ? (
    <div
      className='my-entry-content'
      dangerouslySetInnerHTML={{__html}}
    />
  ) : null
}

EntryContent.propTypes = {
  content: PropTypes.string,
  maybeVisible: PropTypes.bool
}
