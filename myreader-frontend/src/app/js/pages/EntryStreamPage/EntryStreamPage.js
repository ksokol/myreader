import React from 'react'
import PropTypes from 'prop-types'
import {EntryList as EntryListComponent, IconButton, ListLayout} from '../../components'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {withAutofocusEntry} from '../../components/EntryList/withAutofocusEntry'
import {withEntriesFromApi} from '../../components/EntryList/withEntriesFromApi'
import {useSettings} from '../../contexts/settings'
import {useMediaBreakpoint} from '../../contexts/mediaBreakpoint'
import {useHotkeys} from '../../contexts/hotkeys'

const EntryList = withEntriesFromApi(withAutofocusEntry(EntryListComponent))

function Component({searchParams}) {
  const {pageSize: size, showUnseenEntries} = useSettings()
  const {mediaBreakpoint} = useMediaBreakpoint()
  const {onKeyUp} = useHotkeys()

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
  searchParams: PropTypes.shape({
    seenEqual: PropTypes.bool
  }).isRequired,
}

export const EntryStreamPage = withLocationState(Component)
