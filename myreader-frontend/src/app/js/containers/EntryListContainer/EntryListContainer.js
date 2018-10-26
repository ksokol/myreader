import React from 'react'
import {connect} from 'react-redux'
import {
  changeEntry,
  fetchEntries,
  getEntries,
  mediaBreakpointIsDesktopSelector,
  settingsShowEntryDetailsSelector
} from '../../store'
import {EntryList} from '../../components'

const mapStateToProps = state => ({
  ...getEntries(state),
  showEntryDetails: settingsShowEntryDetailsSelector(state),
  isDesktop: mediaBreakpointIsDesktopSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onLoadMore: link => dispatch(fetchEntries(link)),
  onChangeEntry: item => dispatch(changeEntry(item))
})

const EntryListContainer = props => <EntryList {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryListContainer)
