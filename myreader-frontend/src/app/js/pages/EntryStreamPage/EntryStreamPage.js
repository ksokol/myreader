import React from 'react'
import PropTypes from 'prop-types'
import {EntryList, Hotkeys, IconButton, ListLayout} from '../../components'

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
    showEntryDetails: PropTypes.bool.isRequired,
    isDesktop: PropTypes.bool.isRequired,
    onChangeEntry: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    entryFocusNext: PropTypes.func.isRequired,
    previousEntry: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.toggleEntryReadFlag = this.toggleEntryReadFlag.bind(this)
    this.nextEntry = this.nextEntry.bind(this)
    this.previousEntry = this.previousEntry.bind(this)

    this.onKeys = {
      down: this.nextEntry,
      up: this.previousEntry,
      esc: this.toggleEntryReadFlag
    }
  }

  toggleEntryReadFlag() {
    this.props.onChangeEntry({...this.props.entryInFocus, seen: !this.props.entryInFocus.seen})
  }

  nextEntry() {
    if (this.props.nextFocusableEntry.seen === false) {
      this.props.onChangeEntry({...this.props.nextFocusableEntry, seen: true})
    }
    this.props.entryFocusNext()
  }

  previousEntry() {
    this.props.previousEntry()
  }

  render() {
    const {
      entries,
      links,
      entryInFocus,
      loading,
      showEntryDetails,
      isDesktop,
      onChangeEntry,
      onLoadMore
    } = this.props

    const actionPanel = isDesktop ?
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
          isDesktop={isDesktop}
          showEntryDetails={showEntryDetails}
          entries={entries}
          links={links}
          entryInFocus={entryInFocus}
          loading={loading}
          onChangeEntry={onChangeEntry}
          onLoadMore={onLoadMore}
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

export default EntryStreamPage
