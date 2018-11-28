import {componentMock, mockNgRedux, reactComponent} from '../shared/test-utils'

describe('SubscriptionListComponent', () => {

  let ngReduxMock, listPage

  beforeEach(() => {
    listPage = componentMock('myListPage')
    angular.mock.module('myreader', listPage, reactComponent('ContainerComponentBridge'), mockNgRedux())
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    ngReduxMock = $ngRedux
    const scope = $rootScope.$new(true)

    $compile('<my-subscription-list></my-subscription-list>')(scope)
    scope.$digest()
  }))

  it('should update url when search executed', () => {
    listPage.bindings.myOnSearch({params: {q: 'b'}})

    expect(ngReduxMock.getActions()[0]).toContainObject({
      type: 'ROUTE_CHANGED',
      route: ['app', 'subscriptions'],
      query: {q: 'b'}
    })
  })

  it('should refresh state', () => {
    ngReduxMock.clearActions()
    listPage.bindings.myOnRefresh()

    expect(ngReduxMock.getActionTypes()).toEqual(['GET_SUBSCRIPTIONS'])
  })
})
