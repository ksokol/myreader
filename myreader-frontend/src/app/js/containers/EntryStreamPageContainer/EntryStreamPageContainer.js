import React from 'react'
import {connect} from 'react-redux'
import {
  changeEntry,
  entryFocusNext,
  entryFocusPrevious,
  fetchEntries,
  getEntries,
  getNextFocusableEntry,
  mediaBreakpointIsDesktopSelector,
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
  previousEntry: () => dispatch(entryFocusPrevious()),
  entryFocusNext: () => dispatch(entryFocusNext()),
  onLoadMore: link => dispatch(fetchEntries(link))
})

const EntryStreamPageContainer = props => <EntryStreamPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryStreamPageContainer)
