import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {EntryList, Hotkeys, IconButton, ListLayout} from '../../components'
import {
  changeEntry,
  entryClear,
  entryFocusNext,
  entryFocusPrevious,
  fetchEntries,
  getEntries,
  getNextFocusableEntry,
  mediaBreakpointIsDesktopSelector,
  settingsShowEntryDetailsSelector
} from '../../store'
import {SUBSCRIPTION_ENTRIES} from '../../constants'
import {toQueryObject} from '../../shared/location-utils'
import {objectEquals} from '../../shared/utils'

const mapStateToProps = state => ({
  ...getEntries(state),
  showEntryDetails: settingsShowEntryDetailsSelector(state),
  nextFocusableEntry: getNextFocusableEntry(state),
  isDesktop: mediaBreakpointIsDesktopSelector(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changeEntry,
  entryFocusPrevious,
  entryFocusNext,
  fetchEntries,
  entryClear
}, dispatch)

class EntryStreamPage extends React.Component {

  static propTypes = {
    entries: PropTypes.arrayOf(
      PropTypes.any
    ).isRequired,
    entryInFocus: PropTypes.shape({
      seen: PropTypes.bool
    }),
    nextFocusableEntry: PropTypes.shape({
      seen: PropTypes.bool
    }),
    location: PropTypes.shape({
      search: PropTypes.string.isRequired
    }),
    match: PropTypes.object.isRequired,
    links: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    showEntryDetails: PropTypes.bool.isRequired,
    isDesktop: PropTypes.bool.isRequired,
    entryClear: PropTypes.func.isRequired,
    changeEntry: PropTypes.func.isRequired,
    fetchEntries: PropTypes.func.isRequired,
    entryFocusNext: PropTypes.func.isRequired,
    entryFocusPrevious: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.onKeys = {
      down: this.nextEntry,
      up: this.props.entryFocusPrevious,
      esc: this.toggleEntryReadFlag
    }
  }

  componentDidMount() {
    this.props.entryClear()
    this.props.fetchEntries({path: SUBSCRIPTION_ENTRIES, query: toQueryObject(this.props.location)})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!objectEquals(this.props.match, prevProps.match)) {
      this.props.fetchEntries({path: SUBSCRIPTION_ENTRIES, query: toQueryObject(this.props.location)})
    }
  }

  toggleEntryReadFlag = () => {
    this.props.changeEntry({...this.props.entryInFocus, seen: !this.props.entryInFocus.seen})
  }

  nextEntry = () => {
    if (this.props.nextFocusableEntry.seen === false) {
      this.props.changeEntry({...this.props.nextFocusableEntry, seen: true})
    }
    this.props.entryFocusNext()
  }

  render() {
    const {
      entries,
      links,
      entryInFocus,
      loading,
      showEntryDetails,
      isDesktop,
      entryFocusPrevious,
      changeEntry,
      fetchEntries
    } = this.props

    const actionPanel = isDesktop ?
      <React.Fragment>
        <IconButton
          type='chevron-left'
          onClick={entryFocusPrevious}
        />
        <IconButton
          type='chevron-right'
          onClick={this.nextEntry}
        />
      </React.Fragment> : null

    const listPanel =
      <Hotkeys onKeys={this.onKeys}>
        <EntryList
          isDesktop={isDesktop}
          showEntryDetails={showEntryDetails}
          entries={entries}
          links={links}
          entryInFocus={entryInFocus}
          loading={loading}
          onChangeEntry={changeEntry}
          onLoadMore={fetchEntries}
        />
      </Hotkeys>

    return (
      <ListLayout
        actionPanel={actionPanel}
        listPanel={listPanel}
      />
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EntryStreamPage)
)
