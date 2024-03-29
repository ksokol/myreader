
import {useEffect} from 'react'
import createSubscriptionNavigation from './SubscriptionNavigation/createSubscriptionNavigation'
import {NavigationItem} from './NavigationItem'
import {SubscriptionNavigationItem} from './SubscriptionNavigation/SubscriptionNavigationItem'
import {SUBSCRIPTIONS_PAGE_PATH} from '../../constants'
import {useSettings} from '../../contexts/settings'
import {useNavigation} from '../../hooks/navigation'
import {SettingsNavigationItem} from './SettingsNavigationItem/SettingsNavigationItem'
import {SubscribeNavigationItem} from './SubscribeNavigationItem/SubscribeNavigationItem'
import {LogoutNavigationItem} from './LogoutNavigationItem/LogoutNavigationItem'

export function Navigation({onClick}) {
  const {
    subscriptions,
    fetchData,
  } = useNavigation()

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
      <NavigationItem
        title='Subscriptions'
        to={{pathname: SUBSCRIPTIONS_PAGE_PATH}}
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
