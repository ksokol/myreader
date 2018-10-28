import {componentMock, mockNgRedux, multipleReactComponents} from '../shared/test-utils'

class ListItem {

  constructor(el) {
    this.el = angular.element(el)
  }

  title() {
    return this.el.find('h3').text()
  }

  click() {
    this.el[0].click()
  }
}

class ListItems {

  constructor(el) {
    this.el = angular.element(el)
  }

  itemAtIndex(index) {
    return new ListItem(this.el[index])
  }
}

class Page {

  constructor(el) {
    this.el = el
  }

  items() {
    return new ListItems(this.el[0].querySelectorAll('.subscription-list__item'))
  }
}

describe('SubscriptionListComponent', () => {

  let page, scope, ngReduxMock, element, timeAgo

  describe('', () => {

    beforeEach(() => {
      timeAgo = multipleReactComponents('TimeAgo')
      angular.mock.module('myreader', timeAgo, mockNgRedux())
    })

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
      ngReduxMock = $ngRedux
      scope = $rootScope.$new(true)

      ngReduxMock.setState({
        subscription: {
          subscriptions: [
            {uuid: '1', title: 'title1', createdAt: '2017-12-29'},
            {uuid: '2', title: 'title2', createdAt: '2017-11-30'},
            {uuid: '3', title: 'title3', createdAt: '2017-10-29'}
          ]
        }
      })

      element = $compile('<my-subscription-list></my-subscription-list>')(scope)
      page = new Page(element)
      scope.$digest()
    }))

    it('should render subscriptions', () => {
      const items = page.items()

      expect(items.el.length).toEqual(3)

      expect(items.itemAtIndex(0).title()).toEqual('title1')
      expect(timeAgo.bindings[0]).toEqual({date: '2017-12-29'})

      expect(items.itemAtIndex(1).title()).toEqual('title2')
      expect(timeAgo.bindings[1]).toEqual({date: '2017-11-30'})

      expect(items.itemAtIndex(2).title()).toEqual('title3')
      expect(timeAgo.bindings[2]).toEqual({date: '2017-10-29'})
    })

    it('should navigate to subscription detail page on click', () => {
      const items = page.items()
      items.itemAtIndex(2).click()

      expect(ngReduxMock.getActions()[0]).toContainObject({
        type: 'ROUTE_CHANGED',
        route: ['app', 'subscription'],
        query: {uuid: '3'}
      })
    })

    it('should render subscriptions matching search value', () => {
      ngReduxMock.setState({
        router: {
          query: {q: 'title2'}
        }
      })
      scope.$digest()

      const items = page.items()

      expect(items.el.length).toEqual(1)
      expect(items.itemAtIndex(0).title()).toEqual('title2')
    })
  })

  describe('', () => {

    const listPage = componentMock('myListPage')

    beforeEach(angular.mock.module('myreader', listPage, mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
      ngReduxMock = $ngRedux
      scope = $rootScope.$new(true)

      element = $compile('<my-subscription-list></my-subscription-list>')(scope)
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
})
