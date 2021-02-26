import './Navigation.css'
import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import createSubscriptionNavigation from './SubscriptionNavigation/createSubscriptionNavigation'
import NavigationItem from './NavigationItem'
import {SubscriptionNavigationItem} from './SubscriptionNavigation/SubscriptionNavigationItem'
import {
  BOOKMARK_URL,
  LOGOUT_URL,
  SETTINGS_URL,
  SUBSCRIPTION_ADD_URL,
  SUBSCRIPTIONS_URL
} from '../../constants'
import {useSettings} from '../../contexts/settings'
import {useSubscriptions} from '../../hooks/subscriptions'

export function Navigation(props) {
  const {
    onClick
  } = props

  const {
    subscriptions,
    fetchSubscriptions
  } = useSubscriptions()

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const {showUnseenEntries} = useSettings()

  const filteredSubscriptions = subscriptions.filter(it => showUnseenEntries ? it.unseen > 0 : true)

  return (
    <ul className='my-navigation'>
      {
        [
          ...createSubscriptionNavigation(filteredSubscriptions).map(item =>
            <SubscriptionNavigationItem
              key={item.key}
              item={item}
              onClick={onClick}
            />
          ),
          <NavigationItem
            key='subscriptions'
            title='Subscriptions'
            to={SUBSCRIPTIONS_URL}
            onClick={onClick}
          />,
          <NavigationItem
            key='bookmarks'
            title='Bookmarks'
            to={BOOKMARK_URL}
            onClick={onClick}
          />,
          <NavigationItem
            key='settings'
            title='Settings'
            to={SETTINGS_URL}
            onClick={onClick}
          />,
          <NavigationItem
            key='add subscription'
            className='my-navigation__item--blue'
            title='Add subscription'
            to={SUBSCRIPTION_ADD_URL}
            onClick={onClick}
          />
        ]
      }
      <NavigationItem
        key='logout'
        className='my-navigation__item--red'
        title='Logout'
        to={LOGOUT_URL}
        onClick={onClick}
      />
    </ul>
  )
}

Navigation.propTypes = {
  onClick: PropTypes.func.isRequired
}
