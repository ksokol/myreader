import PropTypes from 'prop-types'
import {NavigationItem} from '../NavigationItem'
import {ENTRIES_PAGE_PATH} from '../../../constants'
import {useRouter} from '../../../contexts/router'

function isOpen(searchParams, item) {
  return searchParams.feedTagEqual === item.tag
}

function isVisible(searchParams, item) {
  return isOpen(searchParams, item) && (item.subscriptions ? item.subscriptions.length > 0 : false)
}

function isSelected(searchParams, tag, uuid) {
  const feedUuidEqual = searchParams.feedUuidEqual || null
  const feedTagEqual = searchParams.feedTagEqual || null
  return feedUuidEqual === uuid && feedTagEqual === tag
}

function generateEntriesPath(feedTagEqual, feedUuidEqual) {
  if (feedTagEqual && feedUuidEqual) {
    return {
      pathname: ENTRIES_PAGE_PATH,
      search: `?feedTagEqual=${feedTagEqual}&feedUuidEqual=${feedUuidEqual}`,
    }
  } else if (feedTagEqual) {
    return {
      pathname: ENTRIES_PAGE_PATH,
      search: `?feedTagEqual=${feedTagEqual}`,
    }
  }
  else if (feedUuidEqual) {
    return {
      pathname: ENTRIES_PAGE_PATH,
      search: `?feedUuidEqual=${feedUuidEqual}`,
    }
  }
  return {pathname: ENTRIES_PAGE_PATH}
}

export function SubscriptionNavigationItem(props) {
  const {route} = useRouter()
  const {item, onClick} = props

  return [
    <NavigationItem
      selected={isSelected(route.searchParams, item.tag, item.uuid)}
      to={generateEntriesPath(item.tag, item.uuid)}
      onClick={onClick}
      key={item.uuid}
      title={item.title}
      badgeCount={item.unseen}
    />,
    isVisible(route.searchParams, item) && (
      <ul
        key='subscriptions'
      >
        {item.subscriptions.map(subscription => (
          <NavigationItem
            selected={isSelected(route.searchParams, subscription.tag, subscription.uuid)}
            to={generateEntriesPath(subscription.tag, subscription.uuid)}
            onClick={onClick}
            key={subscription.uuid}
            title={subscription.title}
            badgeCount={subscription.unseen}
          />)
        )}
      </ul>
    )
  ]
}

SubscriptionNavigationItem.propTypes = {
  item: PropTypes.shape({
    uuid: PropTypes.string,
    title: PropTypes.string.isRequired,
    unseen: PropTypes.number.isRequired,
    tag: PropTypes.string,
    subscriptions: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        tag: PropTypes.string,
      }).isRequired
    )
  }).isRequired,
  onClick: PropTypes.func.isRequired
}
