import {reactComponent, mockNgRedux} from '../shared/test-utils'

describe('NavigationComponent', () => {

  let scope, router, subscriptions, ngReduxMock, navigation

  beforeEach(() => {
    navigation = reactComponent('Navigation')
    angular.mock.module('myreader', navigation, mockNgRedux())
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    scope = $rootScope.$new(true)
    ngReduxMock = $ngRedux

    subscriptions = [{uuid: '1'}, {uuid: '2'}]
    router = {query: {feedTagEqual: 'tag', feedUuidEqual: 'uuid'}}

    ngReduxMock.setState({
      subscription: {subscriptions},
      router,
      settings: {showUnseenEntries: false},
      security: {role: 'ROLE_ADMIN'}
    })

    $compile('<my-navigation></my-navigation>')(scope)[0]
    scope.$digest()
  }))

  it('should pass props to navigation component', () => {
    expect(navigation.bindings).toContainObject({
      isAdmin: true,
      subscriptions,
      router,
    })
  })

  it('should trigger routeTo function from navigation component', () => {
    navigation.bindings.routeTo(['expected'], {a: 'b'})

    expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
    expect(ngReduxMock.getActions()[0]).toContainActionData({
      route: ['expected'],
      query: {a: 'b'}
    })
  })
})
