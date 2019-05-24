import React from 'react'
import {Navigation, NavigationItem} from '.'
import {shallow} from 'enzyme'
import {
  ADMIN_FEEDS_URL,
  ADMIN_OVERVIEW_URL,
  BOOKMARK_URL, LOGOUT_URL,
  SETTINGS_URL,
  SUBSCRIPTION_ADD_URL,
  SUBSCRIPTIONS_URL
} from '../../constants'

class NavigationPage {

  constructor(wrapper) {
    this.wrapper = wrapper
  }

  get navigationItemLabels() {
    return this.wrapper.children().reduce((acc, item) => {
      if (item.type() === NavigationItem) {
        return [...acc, item.props().title]
      }
      return [...acc, item.props().item.title]
    }, [])
  }

  get navigationItemRoute() {
    return this.wrapper.children().reduce((acc, item) => {
      return item.prop('to') ? [...acc, item.prop('to')] : acc
    }, [])
  }
}

describe('Navigation', () => {

  let props, subscriptions

  const createWrapper = () => new NavigationPage(shallow(<Navigation {...props} />))

  beforeEach(() => {
    subscriptions = [
      {title: 'subscription 1', uuid: '1', feedTag: {name: 'group 1'}, unseen: 2},
      {title: 'subscription 2', uuid: '2', feedTag: {name: 'group 2'}, unseen: 1},
      {title: 'subscription 3', uuid: '3', feedTag: {name: undefined}, unseen: 0}
    ]

    props = {
      isAdmin: false,
      subscriptions,
      router: {query: {}},
      onClick: jest.fn()
    }
  })

  it('should render user navigation', () => {
    const page = createWrapper()

    expect(page.navigationItemLabels).toEqual([
      'all',
      'group 1',
      'group 2',
      'subscription 3',
      'Subscriptions',
      'Bookmarks',
      'Settings',
      'Add subscription',
      'Logout'
    ])
  })

  it('should render admin navigation', () => {
    props.isAdmin = true
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
      'Feeds',
      'Add subscription',
      'Logout'
    ])
  })

  it('should render expected routes for user', () => {
    expect(createWrapper().navigationItemRoute).toEqual([
      SUBSCRIPTIONS_URL,
      BOOKMARK_URL,
      SETTINGS_URL,
      SUBSCRIPTION_ADD_URL,
      LOGOUT_URL
    ])
  })

  it('should render expected routes for admin', () => {
    props.isAdmin = true

    expect(createWrapper().navigationItemRoute).toEqual([
      SUBSCRIPTIONS_URL,
      BOOKMARK_URL,
      SETTINGS_URL,
      ADMIN_OVERVIEW_URL,
      ADMIN_FEEDS_URL,
      SUBSCRIPTION_ADD_URL,
      LOGOUT_URL
    ])
  })
})
