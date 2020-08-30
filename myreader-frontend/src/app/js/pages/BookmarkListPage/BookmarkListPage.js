import './BookmarkListPage.css'
import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react'
import {Link} from 'react-router-dom'
import {Chips} from '../../components/Chips/Chips'
import {EntryList} from '../../components/EntryList/EntryList'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {BOOKMARK_URL} from '../../constants'
import {entryApi} from '../../api'
import {toast} from '../../components/Toast'
import {useSettings} from '../../contexts/settings'
import {IconButton} from '../../components'
import {useHistory, useSearchParams} from '../../hooks/router'
import {SearchInput} from '../../components/SearchInput/SearchInput'
import {useEntries} from '../../hooks/entries'

export function BookmarkListPage() {
  const [entryTags, setEntryTags] = useState([])
  const {pageSize} = useSettings()
  const searchParams = useSearchParams()
  const ref = useRef(searchParams)
  const {push, reload} = useHistory()

  const query = useMemo(() => {
    const seenEqual = searchParams.entryTagEqual ? '*' : ''
    return {...searchParams, seenEqual, size: pageSize}
  }, [searchParams, pageSize])

  const {
    entries,
    links,
    loading,
    fetchEntries,
    changeEntry,
    clearEntries
  } = useEntries()

  const fetchEntryTags = useCallback(async () => {
    try {
      setEntryTags(await entryApi.fetchEntryTags())
    } catch (error) {
      toast(error.data, {error: true})
    }
  }, [])

  useEffect(() => {
    ref.current = searchParams
  }, [searchParams])

  useEffect(() => {
    fetchEntries({query})
  }, [fetchEntries, query])

  useEffect(() => {
    fetchEntryTags()
  }, [fetchEntryTags])

  const onChange = value => {
    clearEntries()
    push({
      searchParams: {
        ...searchParams,
        ...ref.current,
        q: value,
      }
    })
  }

  const refresh = () => {
    clearEntries()
    fetchEntryTags()
    fetchEntries({query})
    reload()
  }

  const actionPanel =
    <React.Fragment>
      <SearchInput
        className='flex-grow'
        onChange={onChange}
        value={searchParams.q}
      />
      <IconButton
        type='redo'
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
