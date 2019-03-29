import React from 'react'
import {connect} from 'react-redux'
import {
  changeEntry,
  fetchEntries,
  getEntries,
  getEntryTags,
  mediaBreakpointIsDesktopSelector,
  routeChange,
  routeSelector,
  settingsShowEntryDetailsSelector
} from '../../store'
import {BookmarkListPage} from '../../pages'
import {bookmarkTagsRoute} from '../../routes'

const mapStateToProps = state => ({
  ...getEntries(state),
  showEntryDetails: settingsShowEntryDetailsSelector(state),
  isDesktop: mediaBreakpointIsDesktopSelector(state),
  ...getEntryTags(state),
  ...routeSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onSearchChange: query => dispatch(routeChange(bookmarkTagsRoute(query))),
  onLoadMore: link => dispatch(fetchEntries(link)),
  onChangeEntry: item => dispatch(changeEntry(item))
})

const BookmarkListPageContainer = props => <BookmarkListPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkListPageContainer)
