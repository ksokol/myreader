import React from 'react'
import PropTypes from 'prop-types'
import {EntryList as EntryListComponent, IconButton, ListLayout} from '../../components'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {withAppContext} from '../../contexts'
import {withAutofocusEntry} from '../../components/EntryList/withAutofocusEntry'
import {withEntriesFromApi} from '../../components/EntryList/withEntriesFromApi'

const EntryList = withEntriesFromApi(withAutofocusEntry(EntryListComponent))

const Component = ({
 mediaBreakpoint,
 onKeyUp,
 searchParams,
 showUnseenEntries,
 pageSize: size
}) => {
  const showAll = showUnseenEntries === true ? false : '*'
  const seenEqual = searchParams.seenEqual === undefined ? showAll : searchParams.seenEqual
  const query = {...searchParams, seenEqual, size}

  const actionPanel = mediaBreakpoint === 'desktop' ?
    <React.Fragment>
      <IconButton
        type='chevron-left'
        onClick={() => onKeyUp({key: 'ArrowLeft'})}
      />
      <IconButton
        type='chevron-right'
        onClick={() => onKeyUp({key: 'ArrowRight'})}
      />
    </React.Fragment> : null

  const listPanel =
    <EntryList
      query={query}
    />

  return (
    <ListLayout
      actionPanel={actionPanel}
      listPanel={listPanel}
    />
  )
}

Component.propTypes = {
  mediaBreakpoint: PropTypes.string.isRequired,
  searchParams: PropTypes.shape({
    seenEqual: PropTypes.bool
  }).isRequired,
  showUnseenEntries: PropTypes.bool.isRequired,
  pageSize: PropTypes.number.isRequired,
  onKeyUp: PropTypes.func.isRequired
}

export const EntryStreamPage = withLocationState(withAppContext(Component))
