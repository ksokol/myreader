import './Navigation.css'
import React from 'react'
import PropTypes from 'prop-types'
import {createSubscriptionNavigation, NavigationItem, SubscriptionNavigationItem} from '.'

const Navigation = props => {
  const {
    subscriptions,
    router,
    isAdmin,
    routeTo
  } = props

  return (
    <ul className="my-navigation">
      {isAdmin ?
        [
          <NavigationItem key='admin'
                          title='Admin'
                          onClick={() => routeTo(['admin', 'overview'])} />,
          <NavigationItem key='feeds'
                          title='Feeds'
                          onClick={() => routeTo(['admin', 'feed'])} />
        ] :
        [
          ...createSubscriptionNavigation(subscriptions).map(item =>
            <SubscriptionNavigationItem
              key={item.key}
              item={item}
              query={router.query}
              onClick={query => routeTo(['app', 'entries'], {...query, q: undefined /* TODO Remove q query parameter from UI Router */})} />
          ),
          <NavigationItem key='subscriptions'
                          title='Subscriptions'
                          onClick={() => routeTo(['app', 'subscriptions'])} />,
          <NavigationItem key='bookmarks'
                          title='Bookmarks'
                          onClick={() => routeTo(['app', 'bookmarks'])} />,
          <NavigationItem key='settings'
                          title='Settings'
                          onClick={() => routeTo(['app', 'settings'])} />,
          <NavigationItem key='add subscription'
                          className='my-navigation__item--blue'
                          title='Add subscription'
                          onClick={() => routeTo(['app', 'subscription-add'])} />
        ]
      }
      <NavigationItem key='logout'
                      className='my-navigation__item--red'
                      title='Logout'
                      onClick={() => routeTo(['logout'])} />
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
