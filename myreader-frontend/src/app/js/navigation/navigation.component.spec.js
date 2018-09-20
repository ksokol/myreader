import {multipleReactComponents, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/navigation/navigation.component.spec.js', () => {

  let scope, compile, router, subscriptions, ngReduxMock, subscriptionItems

  beforeEach(() => {
    subscriptionItems = multipleReactComponents('SubscriptionNavigationItem')
    angular.mock.module('myreader', subscriptionItems, mockNgRedux())
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    scope = $rootScope.$new(true)
    compile = $compile
    ngReduxMock = $ngRedux

    subscriptions = [
      {title: 'subscription 1', uuid: '1', tag: 'group 1', unseen: 2},
      {title: 'subscription 2', uuid: '2', tag: 'group 2', unseen: 1},
      {title: 'subscription 3', uuid: '3', tag: null, unseen: 0}
    ]
    router = {query: {feedTagEqual: 'tag', feedUuidEqual: 'uuid'}}

    ngReduxMock.setState({
      subscription: {subscriptions},
      settings: {showUnseenEntries: false},
      router
    })
  }))

  function collectLinkTexts(element) {
    const aTags = element.querySelectorAll('span')
    const linkTexts = []
    for (let i = 0; i < aTags.length; i++) {
      linkTexts.push(aTags[i].textContent)
    }
    return linkTexts
  }

  function clickOnAllNavigationItems(element) {
    const aTags = element.querySelectorAll('li')
    for (let i = 0; i < aTags.length; i++) {
      aTags[i].click()
    }
    return ngReduxMock.getActions().filter(action => action.route).map(action => action.route)
  }

  it('should render user navigation', () => {
    const element = compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()

    expect(element.querySelector('react-component[name="SubscriptionNavigationItem"]')).not.toBeNull()
    expect(collectLinkTexts(element)).toEqual(['Subscriptions', 'Bookmarks', 'Settings', 'Add subscription', 'Logout'])
  })

  it('should render admin navigation', () => {
    ngReduxMock.setState({security: {authorized: true, role: 'ROLE_ADMIN'}})
    const element = compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()

    expect(element.querySelector('my-navigation-subscriptions-item')).toBeNull()
    expect(collectLinkTexts(element)).toEqual(['Admin', 'Feeds', 'Logout'])
  })

  it('should route to component on item click', () => {
    const element = compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()
    element.querySelectorAll('li')[2].click()

    expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
    expect(ngReduxMock.getActions()[0]).toContainActionData({route: ['app', 'settings']})
  })

  it('should route to configured user components', () => {
    const element = compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()

    expect(clickOnAllNavigationItems(element))
      .toEqual([['app', 'subscriptions'], ['app', 'bookmarks'], ['app', 'settings'], ['app', 'subscription-add'], ['logout']])
  })

  it('should route to configured admin components', () => {
    ngReduxMock.setState({security: {authorized: true, role: 'ROLE_ADMIN'}})
    const element = compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()

    expect(clickOnAllNavigationItems(element)).toEqual([['admin', 'overview'], ['admin', 'feed'], ['logout']])
  })

  it('should navigate to logout when user clicks on logout button', () => {
    const element = compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()
    element.querySelector('li:last-of-type').click()

    expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
    expect(ngReduxMock.getActions()[0]).toContainActionData({route: ['logout']})
  })

  it('should navigate to logout when admin clicks on logout button', () => {
    ngReduxMock.setState({security: {authorized: true, role: 'ROLE_ADMIN'}})
    const element = compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()
    element.querySelector('li:last-of-type').click()

    expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
    expect(ngReduxMock.getActions()[0]).toContainActionData({route: ['logout']})
  })

  it('should navigate to route with feedTagEqual and feedUuidEqual set', () => {
    compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()
    subscriptionItems.bindings[0].onSelect({feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid'})

    expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
    expect(ngReduxMock.getActions()[0]).toContainActionData({
      route: ['app', 'entries'],
      query: {feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid', q: null}
    })
  })

  it('should create subscription item components', () => {
    compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()

    expect(subscriptionItems.bindings.length).toEqual(4)
    expect(subscriptionItems.bindings[0]).toContainObject({item: {title: 'all'}, query: router.query})
    expect(subscriptionItems.bindings[1]).toContainObject({item: {title: 'group 1'}, query: router.query})
    expect(subscriptionItems.bindings[2]).toContainObject({item: {title: 'group 2'}, query: router.query})
    expect(subscriptionItems.bindings[3]).toContainObject({item: {title: 'subscription 3'}, query: router.query})
  })
})
