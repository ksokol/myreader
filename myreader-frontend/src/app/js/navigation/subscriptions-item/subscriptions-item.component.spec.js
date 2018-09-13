import {mockNgRedux, multipleReactComponents} from '../../shared/test-utils'
import {NavigationSubscriptionsItemComponent} from './subscriptions-item.component'

describe('src/app/js/navigation/subscriptions-item/subscriptions-item.component.spec.js', () => {

  const subscriptions = [
    {title: 'subscription 1', uuid: '1', tag: 'group 1', unseen: 2},
    {title: 'subscription 2', uuid: '2', tag: 'group 2', unseen: 1},
    {title: 'subscription 3', uuid: '3', tag: null, unseen: 0}
  ]

  let compile, scope, ngReduxMock, subscriptionItems, router

  beforeEach(() => {
    subscriptionItems = multipleReactComponents('SubscriptionNavigationItem')
    angular.mock.module('myreader', mockNgRedux(), subscriptionItems)
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    scope = $rootScope.$new(true)
    ngReduxMock = $ngRedux
    compile = $compile

    router = {query: {feedTagEqual: 'tag', feedUuidEqual: 'uuid'}}

    ngReduxMock.setState({
      subscription: {subscriptions},
      settings: {showUnseenEntries: false},
      router
    })
  }))

  it('should create subscription item components with at least one new entry', () => {
    ngReduxMock.setState({settings: {showUnseenEntries: true}})
    compile('<my-navigation-subscriptions-item></my-navigation-subscriptions-item>')(scope)
    scope.$digest()

    expect(subscriptionItems.bindings.length).toEqual(3)
    expect(subscriptionItems.bindings[0]).toContainObject({item: {title: 'all'}})
    expect(subscriptionItems.bindings[1]).toContainObject({item: {title: 'group 1'}})
    expect(subscriptionItems.bindings[2]).toContainObject({item: {title: 'group 2'}})
  })

  it('should construct comparison value for ng-repeat track by', () => {
    const controller = new NavigationSubscriptionsItemComponent.controller()

    expect(controller.trackBy({
      title: 'title',
      unseen: 1
    })).toEqual('{"title":"title","unseen":1,"subscriptions":null}')

    expect(controller.trackBy({
      title: 'title',
      unseen: 1,
      subscriptions: [{}, {}]
    })).toEqual('{"title":"title","unseen":1,"subscriptions":2}')
  })

  describe('', () => {

    beforeEach(() => {
      compile('<my-navigation-subscriptions-item></my-navigation-subscriptions-item>')(scope)
      scope.$digest()
    })

    it('should pass properties to subscription subscription item components', () => {
      expect(subscriptionItems.bindings.length).toEqual(4)
      expect(subscriptionItems.bindings[0]).toContainObject({item: {title: 'all'}, query: router.query})
      expect(subscriptionItems.bindings[1]).toContainObject({item: {title: 'group 1'}, query: router.query})
      expect(subscriptionItems.bindings[2]).toContainObject({item: {title: 'group 2'}, query: router.query})
      expect(subscriptionItems.bindings[3]).toContainObject({item: {title: 'subscription 3'}, query: router.query})
    })

    it('should dispatch route changed action', () => {
      subscriptionItems.bindings[0].onSelect()
      expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
    })

    it('should navigate to route with feedTagEqual and feedUuidEqual set', () => {
      subscriptionItems.bindings[0].onSelect({feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid'})

      expect(ngReduxMock.getActions()[0]).toContainActionData({
        route: ['app', 'entries'],
        query: {feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid'}
      })
    })

    it('should navigate to route with feedTagEqual to null when value is null', () => {
      subscriptionItems.bindings[0].onSelect({feedTagEqual: null, feedUuidEqual: 'selected uuid'})

      expect(ngReduxMock.getActions()[0]).toContainActionData({
        route: ['app', 'entries'],
        query: {feedTagEqual: null, feedUuidEqual: 'selected uuid'}
      })
    })

    it('should navigate to route with feedTagEqual given value and feedUuidEqual set to null when value is null', () => {
      subscriptionItems.bindings[0].onSelect({feedTagEqual: 'selected tag', feedUuidEqual: null})

      expect(ngReduxMock.getActions()[0]).toContainActionData({
        route: ['app', 'entries'],
        query: {feedTagEqual: 'selected tag', feedUuidEqual: null}
      })
    })
  })
})
