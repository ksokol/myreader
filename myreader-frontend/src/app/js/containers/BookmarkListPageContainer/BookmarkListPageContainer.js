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
import {SUBSCRIPTION_ENTRIES} from '../../constants'

const mapStateToProps = state => ({
  ...getEntries(state),
  showEntryDetails: settingsShowEntryDetailsSelector(state),
  isDesktop: mediaBreakpointIsDesktopSelector(state),
  ...getEntryTags(state),
  ...routeSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onRefresh: query => dispatch(fetchEntries({path: SUBSCRIPTION_ENTRIES, query})),
  onSearchChange: query => dispatch(routeChange(['app', 'bookmarks'], query)),
  onLoadMore: link => dispatch(fetchEntries(link)),
  onChangeEntry: item => dispatch(changeEntry(item))
})

const BookmarkListPageContainer = props => <BookmarkListPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkListPageContainer)
