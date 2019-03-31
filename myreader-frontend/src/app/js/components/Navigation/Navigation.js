import './Navigation.css'
import React from 'react'
import PropTypes from 'prop-types'
import {createSubscriptionNavigation, NavigationItem, SubscriptionNavigationItem} from '.'
import {
  adminFeedRoute,
  adminOverviewRoute,
  bookmarksRoute,
  logoutRoute,
  settingsRoute,
  subscriptionAddRoute,
  subscriptionsRoute
} from '../../routes'

const Navigation = props => {
  const {
    subscriptions,
    isAdmin,
    onClick
  } = props

  return (
    <ul className='my-navigation'>
      {isAdmin ?
        [
          <NavigationItem
            key='admin'
            title='Admin'
            to={adminOverviewRoute()}
            onClick={onClick}
          />,
          <NavigationItem
            key='feeds'
            title='Feeds'
            to={adminFeedRoute()}
            onClick={onClick}
          />
        ] :
        [
          ...createSubscriptionNavigation(subscriptions).map(item =>
            <SubscriptionNavigationItem
              key={item.key}
              item={item}
              onClick={onClick}
            />
          ),
          <NavigationItem
            key='subscriptions'
            title='Subscriptions'
            to={subscriptionsRoute()}
            onClick={onClick}
          />,
          <NavigationItem
            key='bookmarks'
            title='Bookmarks'
            to={bookmarksRoute()}
            onClick={onClick}
          />,
          <NavigationItem
            key='settings'
            title='Settings'
            to={settingsRoute()}
            onClick={onClick}
          />,
          <NavigationItem
            key='add subscription'
            className='my-navigation__item--blue'
            title='Add subscription'
            to={subscriptionAddRoute()}
            onClick={onClick}
          />
        ]
      }
      <NavigationItem
        key='logout'
        className='my-navigation__item--red'
        title='Logout'
        to={logoutRoute()}
        onClick={onClick}
      />
    </ul>
  )
}

Navigation.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.any),
  isAdmin: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

Navigation.defaultProps = {
  subscriptions: []
}

export default Navigation
