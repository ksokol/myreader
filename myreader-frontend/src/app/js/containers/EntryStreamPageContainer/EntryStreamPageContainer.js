import React from 'react'
import {connect} from 'react-redux'
import {
  changeEntry,
  entryFocusNext,
  entryFocusPrevious,
  fetchEntries,
  fetchSubscriptions,
  getEntries,
  getNextFocusableEntry,
  mediaBreakpointIsDesktopSelector,
  routeChange,
  routeSelector,
  settingsShowEntryDetailsSelector
} from '../../store'
import {EntryStreamPage} from '../../pages'

const mapStateToProps = state => ({
  ...getEntries(state),
  showEntryDetails: settingsShowEntryDetailsSelector(state),
  nextFocusableEntry: getNextFocusableEntry(state),
  isDesktop: mediaBreakpointIsDesktopSelector(state),
  ...routeSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onChangeEntry: entry => dispatch(changeEntry(entry)),
  onSearchChange: params => dispatch(routeChange(['app', 'entries'], params)),
  previousEntry: () => dispatch(entryFocusPrevious()),
  entryFocusNext: () => dispatch(entryFocusNext()),
  onLoadMore: link => dispatch(fetchEntries(link)),
  onRefresh: params => {
    dispatch(fetchSubscriptions())
    dispatch(routeChange(['app', 'entries'], params, {reload: true}))
  }
})

const EntryStreamPageContainer = props => <EntryStreamPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryStreamPageContainer)
