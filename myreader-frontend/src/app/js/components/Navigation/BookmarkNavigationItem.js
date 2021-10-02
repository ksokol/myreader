import {useState} from 'react'
import PropTypes from 'prop-types'
import {NavigationItem} from './NavigationItem'
import {ENTRIES_PAGE_PATH} from '../../constants'
import {useSearchParams} from '../../hooks/router'

export function BookmarkNavigationItem({onClick, subscriptionEntryTags}) {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  return (
    <>
      <NavigationItem
        key='bookmarks'
        title='Bookmarks'
        to={{}}
        onClick={event => {
          event.preventDefault()
          setOpen(!open)
        }}
      />
      {open && (
        <ul
          key='items'
        >
          {subscriptionEntryTags.map(tag => (
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
      )}
    </>
  )
}

BookmarkNavigationItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  subscriptionEntryTags: PropTypes.arrayOf(PropTypes.string)
}
