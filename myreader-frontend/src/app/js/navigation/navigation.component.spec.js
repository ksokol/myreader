import {componentMock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/navigation/navigation.component.spec.js', () => {

  let scope, compile, router, subscriptions, ngReduxMock, navigationSubscriptionsItem

  beforeEach(() => {
    navigationSubscriptionsItem = componentMock('myNavigationSubscriptionsItem')
    angular.mock.module('myreader', navigationSubscriptionsItem, mockNgRedux())
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

    expect(element.querySelector('my-navigation-subscriptions-item')).not.toBeNull()
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
      .toEqual([['app', 'subscriptions'], ['app', 'bookmarks'], ['app', 'settings'], ['app', 'subscription-add']])
  })

  it('should route to configured admin components', () => {
    ngReduxMock.setState({security: {authorized: true, role: 'ROLE_ADMIN'}})
    const element = compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()

    expect(clickOnAllNavigationItems(element)).toEqual([['admin', 'overview'], ['admin', 'feed']])
  })

  it('should dispatch logout action when user clicks on logout button', () => {
    const element = compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()
    element.querySelector('li:last-of-type').click()

    expect(ngReduxMock.getActionTypes()).toEqual(['POST_LOGOUT'])
  })

  it('should dispatch logout action when admin clicks on logout button', () => {
    ngReduxMock.setState({security: {authorized: true, role: 'ROLE_ADMIN'}})
    const element = compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()
    element.querySelector('li:last-of-type').click()

    expect(ngReduxMock.getActionTypes()).toEqual(['POST_LOGOUT'])
  })

  it('should pass expected bindings to navigation subscriptions item component', () => {
    compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()

    expect(navigationSubscriptionsItem.bindings).toContainObject({
      mySubscriptions: subscriptions,
      myQuery: router.query
    })
  })

  it('should dispatch route changed action', () => {
    compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()

    navigationSubscriptionsItem.bindings.myOnSelect()
    expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
  })

  it('should navigate to route with feedTagEqual and feedUuidEqual set', () => {
    compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()

    navigationSubscriptionsItem.bindings.myOnSelect({query: {feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid'}})

    expect(ngReduxMock.getActions()[0]).toContainActionData({
      route: ['app', 'entries'],
      query: {feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid', q: null}
    })
  })
})
