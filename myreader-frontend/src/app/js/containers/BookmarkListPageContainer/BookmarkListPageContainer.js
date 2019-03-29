import React from 'react'
import {connect} from 'react-redux'
import {
  changeEntry,
  fetchEntries,
  getEntries,
  getEntryTags,
  mediaBreakpointIsDesktopSelector,
  settingsShowEntryDetailsSelector
} from '../../store'
import {BookmarkListPage} from '../../pages'

const mapStateToProps = state => ({
  ...getEntries(state),
  showEntryDetails: settingsShowEntryDetailsSelector(state),
  isDesktop: mediaBreakpointIsDesktopSelector(state),
  ...getEntryTags(state)
})

const mapDispatchToProps = dispatch => ({
  onLoadMore: link => dispatch(fetchEntries(link)),
  onChangeEntry: item => dispatch(changeEntry(item))
})

const BookmarkListPageContainer = props => <BookmarkListPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkListPageContainer)
