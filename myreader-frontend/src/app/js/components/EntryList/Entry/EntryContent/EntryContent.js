import './EntryContent.css'
import React from 'react'
import PropTypes from 'prop-types'
import {useMediaBreakpoint} from '../../../../contexts/mediaBreakpoint'
import {useSettings} from '../../../../contexts/settings'

export function EntryContent({content, maybeVisible}) {
  const {mediaBreakpoint} = useMediaBreakpoint()
  const {showEntryDetails} = useSettings()

  const isVisible = mediaBreakpoint === 'desktop' ? showEntryDetails || maybeVisible : maybeVisible

  return isVisible ? (
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
