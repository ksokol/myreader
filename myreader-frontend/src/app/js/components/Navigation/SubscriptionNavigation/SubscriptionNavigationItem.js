import './SubscriptionNavigationItem.css'
import React from 'react'
import PropTypes from 'prop-types'
import {NavigationItem} from '..'
import {entriesRoute} from '../../../routes'
import {toQueryObject} from '../../../shared/location-utils'
import {withRouter} from 'react-router-dom'

function isOpen(query, item) {
  return query.feedTagEqual === item.tag
}

function isVisible(query, item) {
  return isOpen(query, item) && (item.subscriptions ? item.subscriptions.length > 0 : false)
}

function isSelected(query, tag, uuid) {
  return query.feedUuidEqual === uuid && query.feedTagEqual === tag
}

const SubscriptionNavigationItem = props => {
  const {item, location, onClick} = props
  const query = toQueryObject(location)

  return [
    <NavigationItem
      selected={isSelected(query, item.tag, item.uuid)}
      to={entriesRoute({feedTagEqual: item.tag, feedUuidEqual: item.uuid})}
      onClick={onClick}
      key={item.uuid}
      title={item.title}
      badgeCount={item.unseen}
    />,
    isVisible(query, item) && (
      <ul
        key='subscriptions'
        className='my-subscription-navigation-item__subscriptions'
      >
        {item.subscriptions.map(subscription => (
          <NavigationItem
            selected={isSelected(query, subscription.feedTag.name, subscription.uuid)}
            to={entriesRoute({feedTagEqual: subscription.feedTag.name, feedUuidEqual: subscription.uuid})}
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
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
}

export default withRouter(SubscriptionNavigationItem)
