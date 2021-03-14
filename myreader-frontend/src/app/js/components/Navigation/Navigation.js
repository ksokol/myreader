import './Navigation.css'
import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import createSubscriptionNavigation from './SubscriptionNavigation/createSubscriptionNavigation'
import {NavigationItem} from './NavigationItem'
import {SubscriptionNavigationItem} from './SubscriptionNavigation/SubscriptionNavigationItem'
import {
  LOGOUT_PAGE_PATH,
  SUBSCRIPTIONS_URL
} from '../../constants'
import {useSettings} from '../../contexts/settings'
import {useSubscriptions} from '../../hooks/subscriptions'
import {BookmarkNavigationItem} from './BookmarkNavigationItem/BookmarkNavigationItem'
import {SettingsNavigationItem} from './SettingsNavigationItem/SettingsNavigationItem'
import {SubscribeNavigationItem} from './SubscribeNavigationItem/SubscribeNavigationItem'
import {LogoutNavigationItem} from './LogoutNavigationItem/LogoutNavigationItem'

export function Navigation({onClick}) {
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
          )
        ]
      }
      <BookmarkNavigationItem
        onClick={onClick}
      />
      <NavigationItem
        title='Subscriptions'
        to={SUBSCRIPTIONS_URL}
        onClick={onClick}
      />
      <SettingsNavigationItem
        onClick={onClick}
      />
      <SubscribeNavigationItem
        onClick={onClick}
      />
      <LogoutNavigationItem />
    </ul>
  )
}

Navigation.propTypes = {
  onClick: PropTypes.func.isRequired
}
