import React from 'react'
import {Navigation, NavigationItem} from '.'
import {shallow} from 'enzyme'

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

  navigationItemAt(index) {
    return this.wrapper.children().at(index)
  }

  clickOnAllNavigationItems() {
    const items = this.wrapper.children()
    for (let i = 0; i < items.length; i++) {
      const {item, onClick} = items.at(i).props()

      if (item) {
        const feedTagEqual = item.tag
        const feedUuidEqual = item.subscriptions && item.subscriptions[0] ? item.subscriptions[0].uuid : item.uuid
        onClick({feedTagEqual, feedUuidEqual})
      } else {
        onClick()
      }
    }
  }
}

describe('Navigation', () => {

  let props, subscriptions

  const createPage = () => new NavigationPage(shallow(<Navigation {...props} />))

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
      routeTo: jest.fn()
    }
  })

  it('should render user navigation', () => {
    const page = createPage()

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
    const page = createPage()

    expect(page.navigationItemLabels).toEqual([
      'Admin',
      'Feeds',
      'Logout'
    ])
  })

  it('should route on click on navigation item as user', () => {
    createPage().clickOnAllNavigationItems()

    expect(props.routeTo.mock.calls).toEqual([
      [{route: ['app', 'entries'], query: {feedTagEqual: null, feedUuidEqual: null, q: undefined}}],
      [{route: ['app', 'entries'], query: {feedTagEqual: 'group 1', feedUuidEqual: '1', q: undefined}}],
      [{route: ['app', 'entries'], query: {feedTagEqual: 'group 2', feedUuidEqual: '2', q: undefined}}],
      [{route: ['app', 'entries'], query: {feedTagEqual: undefined, feedUuidEqual: '3', q: undefined}}],
      [{route: ['app', 'subscriptions'], query: {q: undefined}}],
      [{route: ['app', 'bookmarks'], query: {q: undefined}}],
      [{route: ['app', 'settings']}],
      [{route: ['app', 'subscription-add']}],
      [{route: ['logout']}]
    ])
  })

  it('should route on click on navigation item as admin', () => {
    props.isAdmin = true
    createPage().clickOnAllNavigationItems()

    expect(props.routeTo.mock.calls).toEqual([
      [{route: ['admin', 'overview']}],
      [{route: ['admin', 'feed'], query: {q: undefined}}],
      [{route: ['logout']}]
    ])
  })

  it('should navigate to route with feedTagEqual and feedUuidEqual set', () => {
    createPage().navigationItemAt(0).props().onClick({feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid'})

    expect(props.routeTo).toHaveBeenCalledWith({
      route: ['app', 'entries'],
      query: {feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid', q: undefined}
    })
  })
})
