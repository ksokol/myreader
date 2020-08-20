import './BookmarkListPage.css'
import React, {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {Chips} from '../../components/Chips/Chips'
import {EntryList  as EntryListComponent} from '../../components/EntryList/EntryList'
import ListLayout from '../../components/ListLayout/ListLayout'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {BOOKMARK_URL} from '../../constants'
import {entryApi} from '../../api'
import {toast} from '../../components/Toast'
import {withEntriesFromApi} from '../../components/EntryList/withEntriesFromApi'
import {useSettings} from '../../contexts/settings'

const EntryList = withEntriesFromApi(EntryListComponent)

function BookmarkListPage(props) {
  const [entryTags, setEntryTags] = useState([])
  const {pageSize} = useSettings()

  const fetchEntryTags = useCallback(async () => {
    try {
      setEntryTags(await entryApi.fetchEntryTags())
    } catch (error) {
      toast(error.data, {error: true})
    }
  }, [])

  useEffect(() => {
    fetchEntryTags()
  }, [props.locationStateStamp, fetchEntryTags])

  const {
    searchParams: {entryTagEqual, q},
  } = props

  const seenEqual = entryTagEqual ? '*' : ''
  const query = {seenEqual, entryTagEqual, q, size: pageSize}

  return (
    <ListLayout
      className='my-bookmark-list'
      listPanel={
        <React.Fragment>
          <Chips
            keyFn={itemProps => itemProps}
            className='my-bookmark-list__tags'
            values={entryTags}
            selected={entryTagEqual}
            renderItem={item => (
              <Link
                to={{pathname: BOOKMARK_URL, search: `?entryTagEqual=${item}`}}>
                {item}
              </Link>
            )}
          />
          <EntryList
            query={query}
          />
        </React.Fragment>
      }
    />
  )
}

BookmarkListPage.propTypes = {
  searchParams: PropTypes.shape({
    entryTagEqual: PropTypes.string,
    q: PropTypes.string
  }).isRequired,
  locationStateStamp: PropTypes.number.isRequired,
}

export default withLocationState(BookmarkListPage)
