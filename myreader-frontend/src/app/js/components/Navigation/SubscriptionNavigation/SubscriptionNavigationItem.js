import './SubscriptionNavigationItem.css'
import React from 'react'
import PropTypes from 'prop-types'
import {NavigationItem} from '..'
import {ENTRIES_URL} from '../../../constants'
import {withLocationState} from '../../../contexts'

function isOpen(searchParams, item) {
  return searchParams.feedTagEqual === item.tag
}

function isVisible(searchParams, item) {
  return isOpen(searchParams, item) && (item.subscriptions ? item.subscriptions.length > 0 : false)
}

function isSelected(searchParams, tag, uuid) {
  return searchParams.feedUuidEqual === uuid && searchParams.feedTagEqual === tag
}

function generateEntriesPath(feedTagEqual, feedUuidEqual) {
  if (feedTagEqual && feedUuidEqual) {
    return {
      pathname: ENTRIES_URL,
      search: `?feedTagEqual=${feedTagEqual}&feedUuidEqual=${feedUuidEqual}`,
    }
  } else if (feedTagEqual) {
    return {
      pathname: ENTRIES_URL,
      search: `?feedTagEqual=${feedTagEqual}`,
    }
  }
  else if (feedUuidEqual) {
    return {
      pathname: ENTRIES_URL,
      search: `?feedUuidEqual=${feedUuidEqual}`,
    }
  }
  return {pathname: ENTRIES_URL}
}

const SubscriptionNavigationItem = props => {
  const {item, searchParams, onClick} = props

  return [
    <NavigationItem
      selected={isSelected(searchParams, item.tag, item.uuid)}
      to={generateEntriesPath(item.tag, item.uuid)}
      onClick={onClick}
      key={item.uuid}
      title={item.title}
      badgeCount={item.unseen}
    />,
    isVisible(searchParams, item) && (
      <ul
        key='subscriptions'
        className='my-subscription-navigation-item__subscriptions'
      >
        {item.subscriptions.map(subscription => (
          <NavigationItem
            selected={isSelected(searchParams, subscription.feedTag.name, subscription.uuid)}
            to={generateEntriesPath(subscription.feedTag.name, subscription.uuid)}
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
        feedTag: PropTypes.shape({
          uuid: PropTypes.string,
          name: PropTypes.string
        }).isRequired
      }).isRequired
    )
  }).isRequired,
  searchParams: PropTypes.shape({
    feedTagEqual: PropTypes.string,
    feedUuidEqual: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
}

export default withLocationState(SubscriptionNavigationItem)
