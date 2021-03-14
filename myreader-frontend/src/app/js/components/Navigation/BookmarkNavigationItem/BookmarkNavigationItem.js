import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {NavigationItem} from '../NavigationItem'
import {ENTRIES_PAGE_PATH} from '../../../constants'
import {useEntryTags} from './entryTags'
import {useSearchParams} from '../../../hooks/router'
import {toast} from '../../Toast'

export function BookmarkNavigationItem({onClick}) {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const {entryTags, error, fetchEntryTags} = useEntryTags()

  useEffect(() => {
    if (open) {
      fetchEntryTags()
    }
  }, [fetchEntryTags, open])

  useEffect(() => {
    if (error) {
      toast(error, {error: true})
    }
  }, [error])

  return [
    <NavigationItem
      key='bookmarks'
      title='Bookmarks'
      to={{}}
      onClick={event => {
        event.preventDefault()
        setOpen(!open)
      }}
    />,
    open && (
      <ul
        key='items'
      >
        {entryTags.map(tag => (
          <NavigationItem
            key={tag}
            selected={searchParams.entryTagEqual === tag}
            to={{
              pathname: ENTRIES_PAGE_PATH,
              search: `?seenEqual=*&entryTagEqual=${tag}`
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
