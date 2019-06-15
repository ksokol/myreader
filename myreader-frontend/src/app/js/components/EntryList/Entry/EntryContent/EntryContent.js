import './EntryContent.css'
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {mediaBreakpointIsDesktopSelector, settingsShowEntryDetailsSelector} from '../../../../store'

const mapStateToProps = state => ({
  showEntryDetails: settingsShowEntryDetailsSelector(state),
  isDesktop: mediaBreakpointIsDesktopSelector(state)
})

const entryContent = ({content: __html, isDesktop, maybeVisible, showEntryDetails}) => {
  const isVisible = isDesktop ? showEntryDetails || maybeVisible : maybeVisible
  return isVisible ? (
    <div
      className='my-entry-content'
      dangerouslySetInnerHTML={{__html}}
    />
  ) : null
}

entryContent.propTypes = {
  content: PropTypes.string,
  isDesktop: PropTypes.bool.isRequired,
  showEntryDetails: PropTypes.bool.isRequired,
  maybeVisible: PropTypes.bool
}

export const EntryContent = connect(mapStateToProps)(entryContent)
