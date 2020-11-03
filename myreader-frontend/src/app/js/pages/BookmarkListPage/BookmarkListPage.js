import './BookmarkListPage.css'
import React, {useEffect, useMemo} from 'react'
import {Link} from 'react-router-dom'
import {Chips} from '../../components/Chips/Chips'
import {EntryList} from '../../components/EntryList/EntryList'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {BOOKMARK_URL} from '../../constants'
import {toast} from '../../components/Toast'
import {useSettings} from '../../contexts/settings'
import IconButton from '../../components/Buttons/IconButton/IconButton'
import {useHistory, useSearchParams} from '../../hooks/router'
import {SearchInput} from '../../components/SearchInput/SearchInput'
import {useEntries} from '../../hooks/entries'

export function BookmarkListPage() {
  const {pageSize} = useSettings()
  const searchParams = useSearchParams()
  const {push, reload} = useHistory()

  const query = useMemo(() => {
    const seenEqual = searchParams.entryTagEqual ? '*' : ''
    return {...searchParams, seenEqual, size: pageSize}
  }, [searchParams, pageSize])

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

  const onChange = value => {
    push({
      searchParams: {
        ...searchParams,
        q: value,
      }
    })
  }

  const refresh = () => {
    clearEntries()
    clearEntryTags()
    fetchEntryTags()
    fetchEntries({query})
    reload()
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

  const actionPanel =
    <React.Fragment>
      <SearchInput
        onChange={onChange}
        value={searchParams.q}
      />
      <IconButton
        type='redo'
        role='refresh'
        onClick={refresh}
      />
    </React.Fragment>

  return (
    <ListLayout
      className='my-bookmark-list'
      actionPanel={actionPanel}
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
