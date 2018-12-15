import React from 'react'
import PropTypes from 'prop-types'
import {Hotkeys, IconButton, ListPage, EntryList} from '..'

class EntryStreamPage extends React.Component {

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
      router,
      entries,
      links,
      entryInFocus,
      loading,
      showEntryDetails,
      isDesktop,
      onSearchChange,
      onChangeEntry,
      onLoadMore,
      onRefresh
    } = this.props

    const actionPanel = isDesktop ?
      <React.Fragment>
        <IconButton type='chevron-left' onClick={this.previousEntry} />
        <IconButton type='chevron-right' onClick={this.nextEntry} />
      </React.Fragment> : null

    const listPanel =
      <Hotkeys onKeys={this.onKeys}>
        <EntryList isDesktop={isDesktop}
                   showEntryDetails={showEntryDetails}
                   entries={entries}
                   links={links}
                   entryInFocus={entryInFocus}
                   loading={loading}
                   onChangeEntry={onChangeEntry}
                   onLoadMore={onLoadMore} />
      </Hotkeys>

    return (
      <ListPage router={router}
                onSearchChange={onSearchChange}
                onRefresh={() => onRefresh({...router.query})}
                actionPanel={actionPanel}
                listPanel={listPanel} />
    )
  }
}

EntryStreamPage.propTypes = {
  router: PropTypes.shape({
    query: PropTypes.object
  }).isRequired,
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
  onSearchChange: PropTypes.func.isRequired,
  onChangeEntry: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  entryFocusNext: PropTypes.func.isRequired,
  previousEntry: PropTypes.func.isRequired
}

export default EntryStreamPage
