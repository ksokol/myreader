import './EntryContent.css'
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {settingsShowEntryDetailsSelector} from '../../../../store'
import MediaBreakpointContext from '../../../../contexts/mediaBreakpoint/MediaBreakpointContext'

const mapStateToProps = state => ({
  showEntryDetails: settingsShowEntryDetailsSelector(state)
})

const Component = ({content: __html, mediaBreakpoint, maybeVisible, showEntryDetails}) => {
  const isVisible = mediaBreakpoint === 'desktop' ? showEntryDetails || maybeVisible : maybeVisible
  return isVisible ? (
    <div
      className='my-entry-content'
      dangerouslySetInnerHTML={{__html}}
    />
  ) : null
}

Component.propTypes = {
  content: PropTypes.string,
  mediaBreakpoint: PropTypes.string.isRequired,
  showEntryDetails: PropTypes.bool.isRequired,
  maybeVisible: PropTypes.bool
}

export const EntryContent = connect(mapStateToProps)(props => (
  <MediaBreakpointContext.Consumer>
    {value => <Component {...props} {...value} />}
  </MediaBreakpointContext.Consumer>
))
