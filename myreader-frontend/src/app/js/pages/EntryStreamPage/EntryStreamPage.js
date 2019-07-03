import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {EntryList, Hotkeys, IconButton, ListLayout} from '../../components'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {changeEntry, entryClear, fetchEntries, getEntries} from '../../store'
import {SUBSCRIPTION_ENTRIES} from '../../constants'
import {withAppContext} from '../../contexts'
import {isDefined} from '../../shared/utils'

const mapStateToProps = state => ({
  ...getEntries(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changeEntry,
  fetchEntries,
  entryClear
}, dispatch)

class Component extends React.Component {

  static propTypes = {
    entries: PropTypes.arrayOf(
      PropTypes.any
    ).isRequired,
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
    showUnseenEntries: PropTypes.bool.isRequired,
    pageSize: PropTypes.number.isRequired,
  }

  state = {
    entryInFocus: {}
  }

  constructor(props) {
    super(props)

    this.onKeys = {
      down: this.nextEntry,
      up: this.previousEntry,
      esc: this.toggleEntryReadFlag
    }
  }

  static getDerivedStateFromProps(props, state) {
    const entryInFocus = props.entries.find(it => it.uuid === state.entryInFocus.uuid) || {}
    return {
      entryInFocus
    }
  }

  componentDidMount() {
    this.fetchEntries()
  }

  componentDidUpdate() {
    if ((this.props.locationChanged || this.props.locationReload)) {
      this.fetchEntries()
      this.setState(state => {
        return isDefined(state.entryInFocus.uuid) ? {
          entryInFocus: {}
        } : null
      })
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
    if (this.state.entryInFocus.uuid) {
      this.props.changeEntry({
        ...this.state.entryInFocus,
        seen: !this.state.entryInFocus.seen
      })
    }
  }

  nextEntry = () => {
    const {
      entries
    } = this.props

    const {
      entryInFocus
    } = this.state

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

      this.setState({
        entryInFocus: nextFocusableEntry
      })
    }
  }

  previousEntry = () => {
    const {
      entries
    } = this.props

    const {
      entryInFocus
    } = this.state

    if (!entryInFocus.uuid) {
      return
    }

    const index = entries.findIndex(it => it.uuid === entryInFocus.uuid)

    this.setState({
      entryInFocus: entries[index - 1] || {}
    })

  }

  render() {
    const {
      entries,
      links,
      loading,
      mediaBreakpoint,
      changeEntry,
      fetchEntries
    } = this.props

    const {
      entryInFocus
    } = this.state

    const actionPanel = mediaBreakpoint === 'desktop' ?
      <React.Fragment>
        <IconButton
          type='chevron-left'
          onClick={this.previousEntry}
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
