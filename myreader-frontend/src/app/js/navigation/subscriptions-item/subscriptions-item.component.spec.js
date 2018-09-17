import {multipleReactComponents} from '../../shared/test-utils'

describe('src/app/js/navigation/subscriptions-item/subscriptions-item.component.spec.js', () => {

  let compile, scope, subscriptions, subscriptionItems

  beforeEach(() => {
    subscriptionItems = multipleReactComponents('SubscriptionNavigationItem')
    angular.mock.module('myreader', subscriptionItems)
  })

  beforeEach(inject(($rootScope, $compile) => {
    scope = $rootScope.$new(true)
    compile = $compile

    scope.subscriptions = subscriptions = [
      {title: 'subscription 1', uuid: '1', tag: 'group 1', unseen: 2},
      {title: 'subscription 2', uuid: '2', tag: 'group 2', unseen: 1},
      {title: 'subscription 3', uuid: '3', tag: null, unseen: 0}
    ]
    scope.query = {query: {feedTagEqual: 'tag', feedUuidEqual: 'uuid'}}
    scope.onSelect = jest.fn()

    compile(`<my-navigation-subscriptions-item
                my-subscriptions="subscriptions"
                my-query="query"
                my-on-select="onSelect(query)">
             </my-navigation-subscriptions-item>`)(scope)
    scope.$digest()
  }))

  it('should create subscription item components', () => {
    expect(subscriptionItems.bindings.length).toEqual(4)
    expect(subscriptionItems.bindings[0]).toContainObject({item: {title: 'all'}, query: scope.query})
    expect(subscriptionItems.bindings[1]).toContainObject({item: {title: 'group 1'}, query: scope.query})
    expect(subscriptionItems.bindings[2]).toContainObject({item: {title: 'group 2'}, query: scope.query})
    expect(subscriptionItems.bindings[3]).toContainObject({item: {title: 'subscription 3'}, query: scope.query})
  })

  it('should forward call to prop function "onSelect" to binding function "myOnSelect"', () => {
    subscriptionItems.bindings[0].onSelect({feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid'})

    expect(scope.onSelect).toHaveBeenCalledWith({feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid'})
  })
})
