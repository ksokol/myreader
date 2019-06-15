import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {EntryList, Hotkeys, IconButton, ListLayout} from '../../components'
import {withLocationState} from '../../contexts'
import {
  changeEntry,
  entryClear,
  entryFocusNext,
  entryFocusPrevious,
  fetchEntries,
  getEntries,
  getNextFocusableEntry,
  mediaBreakpointIsDesktopSelector
} from '../../store'
import {SUBSCRIPTION_ENTRIES} from '../../constants'

const mapStateToProps = state => ({
  ...getEntries(state),
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
    links: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    isDesktop: PropTypes.bool.isRequired,
    searchParams: PropTypes.object.isRequired,
    locationChanged: PropTypes.bool.isRequired,
    locationReload: PropTypes.bool.isRequired,
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
    this.fetchEntries()
  }

  componentDidUpdate() {
    if (this.props.locationChanged || this.props.locationReload) {
      this.fetchEntries()
    }
  }

  fetchEntries = () => {
    this.props.entryClear()
    this.props.fetchEntries({
      path: SUBSCRIPTION_ENTRIES,
      query: {...this.props.searchParams}
    })
  }

  toggleEntryReadFlag = () => {
    this.props.changeEntry({
      ...this.props.entryInFocus,
      seen: !this.props.entryInFocus.seen
    })
  }

  nextEntry = () => {
    if (this.props.nextFocusableEntry.seen === false) {
      this.props.changeEntry({
        ...this.props.nextFocusableEntry,
        seen: true
      })
    }
    this.props.entryFocusNext()
  }

  render() {
    const {
      entries,
      links,
      entryInFocus,
      loading,
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

export default withLocationState(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EntryStreamPage)
)
