import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {useRouteMatch} from 'react-router-dom'
import {NavigationItem} from '../NavigationItem'
import {BOOKMARK_PAGE_PATH} from '../../../constants'
import {useEntryTags} from './entryTags'
import {useSearchParams} from '../../../hooks/router'
import {toast} from '../../Toast'

export function BookmarkNavigationItem({onClick}) {
  const match = useRouteMatch(BOOKMARK_PAGE_PATH)
  const searchParams = useSearchParams()
  const [fetched, setFetched] = useState(false)
  const {entryTags, error, fetchEntryTags} = useEntryTags()

  useEffect(() => {
    if (match && !fetched) {
      setFetched(true)
      fetchEntryTags()
    }
  }, [fetchEntryTags, fetched, match])

  useEffect(() => {
    if (error) {
      toast(error, {error: true})
    }
  }, [error])

  return [
    <NavigationItem
      key='bookmarks'
      title='Bookmarks'
      to={BOOKMARK_PAGE_PATH}
    />,
    match && (
      <ul
        key='items'
      >
        {entryTags.map(tag => (
          <NavigationItem
            key={tag}
            selected={searchParams.entryTagEqual === tag}
            to={{
              pathname: BOOKMARK_PAGE_PATH,
              search: `?entryTagEqual=${tag}`
            }}
            onClick={onClick}
            title={tag}
          />)
        )}
      </ul>
    )
  ]
}

BookmarkNavigationItem.propTypes = {
  onClick: PropTypes.func.isRequired
}
