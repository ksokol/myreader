import './Navigation.css'
import React from 'react'
import PropTypes from 'prop-types'
import {createSubscriptionNavigation, NavigationItem, SubscriptionNavigationItem} from '.'
import {
  adminFeedRoute,
  adminOverviewRoute,
  bookmarksRoute,
  entriesRoute,
  logoutRoute,
  settingsRoute,
  subscriptionAddRoute,
  subscriptionsRoute
} from '../../../../routes'

const Navigation = props => {
  const {
    subscriptions,
    router,
    isAdmin,
    routeTo
  } = props

  return (
    <ul className='my-navigation'>
      {isAdmin ?
        [
          <NavigationItem
            key='admin'
            title='Admin'
            onClick={() => routeTo(adminOverviewRoute())}
          />,
          <NavigationItem
            key='feeds'
            title='Feeds'
            onClick={() => routeTo(adminFeedRoute())}
          />
        ] :
        [
          ...createSubscriptionNavigation(subscriptions).map(item =>
            <SubscriptionNavigationItem
              key={item.key}
              item={item}
              query={router.query}
              onClick={query => routeTo(entriesRoute(query))}
            />
          ),
          <NavigationItem
            key='subscriptions'
            title='Subscriptions'
            onClick={() => routeTo(subscriptionsRoute())}
          />,
          <NavigationItem
            key='bookmarks'
            title='Bookmarks'
            onClick={() => routeTo(bookmarksRoute())}
          />,
          <NavigationItem
            key='settings'
            title='Settings'
            onClick={() => routeTo(settingsRoute())}
          />,
          <NavigationItem
            key='add subscription'
            className='my-navigation__item--blue'
            title='Add subscription'
            onClick={() => routeTo(subscriptionAddRoute())}
          />
        ]
      }
      <NavigationItem
        key='logout'
        className='my-navigation__item--red'
        title='Logout'
        onClick={() => routeTo(logoutRoute())}
      />
    </ul>
  )
}

Navigation.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.any),
  router: PropTypes.shape({
    query: PropTypes.any
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  routeTo: PropTypes.func.isRequired
}

Navigation.defaultProps = {
  subscriptions: []
}

export default Navigation
