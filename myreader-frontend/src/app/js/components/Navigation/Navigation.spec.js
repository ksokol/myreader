import React from 'react'
import {mount} from 'enzyme'
import Navigation from './Navigation'
import NavigationItem from './NavigationItem'
import {
  ADMIN_OVERVIEW_URL,
  BOOKMARK_URL, LOGOUT_URL,
  SETTINGS_URL,
  SUBSCRIPTION_ADD_URL,
  SUBSCRIPTIONS_URL
} from '../../constants'
import SubscriptionContext from '../../contexts/subscription/SubscriptionContext'
import {useSettings} from '../../contexts/settings'

/* eslint-disable react/prop-types */
jest.mock('./SubscriptionNavigation/SubscriptionNavigationItem', () => ({
  SubscriptionNavigationItem: () => null
}))

jest.mock('../../contexts/settings', () => ({
  useSettings: jest.fn()
}))
/* eslint-enable */

class NavigationPage {

  constructor(wrapper) {
    this.wrapper = wrapper
  }

  get navigationItems() {
    return this.wrapper.find('ul').children()
  }

  get navigationItemLabels() {
    return this.navigationItems.reduce((acc, item) => {
      if (item.type() === NavigationItem) {
        return [...acc, item.prop('title')]
      }
      return [...acc, item.prop('item').title]
    }, [])
  }

  get navigationItemRoute() {
    return this.navigationItems.reduce((acc, item) => {
      return item.prop('to') ? [...acc, item.prop('to')] : acc
    }, [])
  }
}

describe('Navigation', () => {

  let props, value

  const createWrapper = () => new NavigationPage(
    mount(
      <SubscriptionContext.Provider value={value}>
        <Navigation {...props} />
      </SubscriptionContext.Provider>
    )
  )

  beforeEach(() => {
    useSettings.mockReturnValue({
      showUnseenEntries: false,
    })

    props = {
      onClick: jest.fn()
    }

    value = {
      subscriptions: [
        {title: 'subscription 1', uuid: '1', feedTag: {name: 'group 1'}, unseen: 2},
        {title: 'subscription 2', uuid: '2', feedTag: {name: 'group 2'}, unseen: 1},
        {title: 'subscription 3', uuid: '3', feedTag: {name: undefined}, unseen: 0}
      ]
    }
  })

  it('should render navigation labels', () => {
    const page = createWrapper()

    expect(page.navigationItemLabels).toEqual([
      'all',
      'group 1',
      'group 2',
      'subscription 3',
      'Subscriptions',
      'Bookmarks',
      'Settings',
      'Admin',
      'Add subscription',
      'Logout'
    ])
  })

  it('should render expected routes', () => {
    expect(createWrapper().navigationItemRoute).toEqual([
      SUBSCRIPTIONS_URL,
      BOOKMARK_URL,
      SETTINGS_URL,
      ADMIN_OVERVIEW_URL,
      SUBSCRIPTION_ADD_URL,
      LOGOUT_URL
    ])
  })

  it('should trigger prop function "onClick" on each navigation item click', () => {
    const wrapper = createWrapper()
    wrapper.navigationItems.forEach(item => item.invoke('onClick')())

    expect(props.onClick).toHaveBeenCalledTimes(10)
  })

  it('should render navigation with subscriptions.unseen > 0', () => {
    useSettings.mockReturnValue({showUnseenEntries: true})
    const page = createWrapper()

    expect(page.navigationItemLabels).toEqual([
      'all',
      'group 1',
      'group 2',
      'Subscriptions',
      'Bookmarks',
      'Settings',
      'Admin',
      'Add subscription',
      'Logout'
    ])
  })
})
