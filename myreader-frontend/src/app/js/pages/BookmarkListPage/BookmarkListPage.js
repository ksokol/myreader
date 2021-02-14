import './BookmarkListPage.css'
import React, {useEffect, useMemo} from 'react'
import {Link} from 'react-router-dom'
import {Chips} from '../../components/Chips/Chips'
import {EntryList} from '../../components/EntryList/EntryList'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {BOOKMARK_URL} from '../../constants'
import {toast} from '../../components/Toast'
import IconButton from '../../components/Buttons/IconButton/IconButton'
import {useHistory, useSearchParams} from '../../hooks/router'
import {useEntries} from '../../hooks/entries'

export function BookmarkListPage() {
  const searchParams = useSearchParams()
  const {reload} = useHistory()

  const query = useMemo(() => {
    const seenEqual = searchParams.entryTagEqual ? undefined : true
    const entryTagEqual = searchParams.entryTagEqual ? searchParams.entryTagEqual : ''
    return {...searchParams, seenEqual, entryTagEqual}
  }, [searchParams])

  const {
    entries,
    entryTags,
    links,
    loading,
    lastError,
    fetchEntries,
    fetchEntryTags,
    changeEntry,
    clearEntries,
    clearEntryTags,
  } = useEntries()

  const refresh = () => {
    if (!loading) {
      clearEntries()
      clearEntryTags()
      fetchEntryTags()
      fetchEntries({query})
      reload()
    }
  }

  useEffect(() => {
    fetchEntryTags()
  }, [fetchEntryTags])

  useEffect(() => {
    fetchEntries({query})
  }, [fetchEntries, query])

  useEffect(() => {
    clearEntries()
  }, [clearEntries, searchParams])

  useEffect(() => {
    if (lastError) {
      toast(lastError.data, {error: true})
    }
  }, [lastError])

  return (
    <ListLayout
      actionPanel={
        <IconButton
          type='redo'
          role='refresh'
          inverse={true}
          onClick={refresh}
        />
      }
      listPanel={
        <React.Fragment>
          <Chips
            keyFn={itemProps => itemProps}
            className='my-bookmark-list__tags'
            values={entryTags}
            selected={searchParams.entryTagEqual}
            renderItem={item => (
              <Link
                to={{pathname: BOOKMARK_URL, search: `?entryTagEqual=${item}`}}>
                {item}
              </Link>
            )}
          />
          <EntryList
            entries={entries}
            links={links}
            loading={loading}
            onChangeEntry={changeEntry}
            onLoadMore={fetchEntries}
          />
        </React.Fragment>
      }
    />
  )
}
