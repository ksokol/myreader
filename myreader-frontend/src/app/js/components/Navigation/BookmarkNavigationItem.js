import {useState} from 'react'
import PropTypes from 'prop-types'
import {NavigationItem} from './NavigationItem'
import {ENTRIES_PAGE_PATH} from '../../constants'
import {useRouter} from '../../contexts/router'

export function BookmarkNavigationItem({onClick, subscriptionEntryTags}) {
  const {route} = useRouter()
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
              selected={route.searchParams.entryTagEqual === tag}
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
