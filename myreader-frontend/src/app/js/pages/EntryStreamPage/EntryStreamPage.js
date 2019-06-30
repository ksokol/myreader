import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {EntryList, Hotkeys, IconButton, ListLayout} from '../../components'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {changeEntry, entryClear, entryFocusNext, entryFocusPrevious, fetchEntries, getEntries} from '../../store'
import {SUBSCRIPTION_ENTRIES} from '../../constants'
import {withAppContext} from '../../contexts'

const mapStateToProps = state => ({
  ...getEntries(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changeEntry,
  entryFocusPrevious,
  entryFocusNext,
  fetchEntries,
  entryClear
}, dispatch)

class Component extends React.Component {

  static propTypes = {
    entries: PropTypes.arrayOf(
      PropTypes.any
    ).isRequired,
    entryInFocus: PropTypes.shape({
      seen: PropTypes.bool
    }),
    links: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    mediaBreakpoint: PropTypes.string.isRequired,
    searchParams: PropTypes.shape({
      seenEqual: PropTypes.bool
    }).isRequired,
    locationChanged: PropTypes.bool.isRequired,
    locationReload: PropTypes.bool.isRequired,
    entryClear: PropTypes.func.isRequired,
    changeEntry: PropTypes.func.isRequired,
    fetchEntries: PropTypes.func.isRequired,
    entryFocusNext: PropTypes.func.isRequired,
    entryFocusPrevious: PropTypes.func.isRequired,
    showUnseenEntries: PropTypes.bool.isRequired,
    pageSize: PropTypes.number.isRequired,
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

    const {
      searchParams,
      showUnseenEntries,
      pageSize: size
    } = this.props
    const seenEqual = searchParams.seenEqual === undefined ? showUnseenEntries === true ? false : '*' : searchParams.seenEqual
    const query = {...searchParams, seenEqual, size}

    this.props.fetchEntries({
      path: SUBSCRIPTION_ENTRIES,
      query
    })
  }

  toggleEntryReadFlag = () => {
    this.props.changeEntry({
      ...this.props.entryInFocus,
      seen: !this.props.entryInFocus.seen
    })
  }

  nextEntry = () => {
    const {
      entries,
      entryInFocus = {}
    } = this.props
    let nextFocusableEntry

    if (!entryInFocus.uuid) {
      nextFocusableEntry = entries[0]
    } else {
      const index = entries.findIndex(it => it.uuid === entryInFocus.uuid)
      nextFocusableEntry = entries[index + 1]
    }

    if (nextFocusableEntry) {
      if (nextFocusableEntry.seen === false) {
        this.props.changeEntry({
          ...nextFocusableEntry,
          seen: true
        })
      }

      this.props.entryFocusNext()
    }
  }

  render() {
    const {
      entries,
      links,
      entryInFocus,
      loading,
      mediaBreakpoint,
      entryFocusPrevious,
      changeEntry,
      fetchEntries
    } = this.props

    const actionPanel = mediaBreakpoint === 'desktop' ?
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

export const EntryStreamPage = withLocationState(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withAppContext(Component))
)
