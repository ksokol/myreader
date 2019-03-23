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
  settingsShowEntryDetailsSelector
} from '../../store'
import {EntryStreamPage} from '../../pages'
import {entriesRoute} from '../../routes'

const mapStateToProps = state => ({
  ...getEntries(state),
  showEntryDetails: settingsShowEntryDetailsSelector(state),
  nextFocusableEntry: getNextFocusableEntry(state),
  isDesktop: mediaBreakpointIsDesktopSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onChangeEntry: entry => dispatch(changeEntry(entry)),
  onSearchChange: params => dispatch(routeChange(entriesRoute(params))),
  previousEntry: () => dispatch(entryFocusPrevious()),
  entryFocusNext: () => dispatch(entryFocusNext()),
  onLoadMore: link => dispatch(fetchEntries(link)),
  onRefresh: params => {
    dispatch(fetchSubscriptions())
    dispatch(routeChange(entriesRoute(params), {reload: true}))
  }
})

const EntryStreamPageContainer = props => <EntryStreamPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryStreamPageContainer)
