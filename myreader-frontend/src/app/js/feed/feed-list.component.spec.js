import {componentMock, filterMock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/feed/feed-list.component.spec.js', () => {

  const feeds = [{
    uuid: 1,
    title: 'title 1',
    hasErrors: false,
    createdAt: 'createdAt 1'
  }, {
    uuid: 2,
    title: 'title 2',
    hasErrors: true,
    createdAt: 'createdAt 2'
  }]

  let scope, element, page, ngReduxMock

  const Feed = el => {
    return {
      title: () => el.querySelector('h3'),
      createdAt: () => el.querySelector('span'),
      errorIcon: () => el.querySelector('react-component[name="Icon"]') || undefined,
      click: () => el.click()
    }
  }

  const PageObject = el => {
    return {
      feedList: () => {
        const feeds = []
        const items = el.querySelectorAll('.feed-list__item')
        for (let i = 0; i < items.length; i++) {
          feeds.push(Feed(items[i]))
        }
        return feeds
      }
    }
  }

  const givenState = (router = {}) => {
    ngReduxMock.setState({router})
    scope.$digest()
  }

  describe('', () => {

    beforeEach(angular.mock.module('myreader', filterMock('timeago'), mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
      scope = $rootScope.$new(true)
      ngReduxMock = $ngRedux
      ngReduxMock.setState({admin: {feeds}})

      element = $compile('<my-feed-list></my-feed-list>')(scope)
      page = PageObject(element[0])
      scope.$digest()
    }))

    it('should show feed items', () => {
      expect(page.feedList()[0].title().textContent).toEqual('title 1')
      expect(page.feedList()[1].title().textContent).toEqual('title 2')
    })

    it('should sanitize feed title', () => {
      expect(page.feedList()[0].title().classList).toContain('ng-binding')
    })

    it('should show error icon when feed has fetch errors', () => {
      expect(page.feedList()[0].errorIcon()).toBeUndefined()
      expect(page.feedList()[1].errorIcon()).toBeDefined()
    })

    xit('should render error icon when feed err', () => {
      expect(page.feedList()[1].errorIcon().attributes['my-type'].value).toEqual('exclamation-triangle')
    })

    it('should pass feed creation date to timeago pipe', () => {
      expect(page.feedList()[0].createdAt().textContent).toContain('timeago("createdAt 1")')
    })

    it('should navigate to feed detail page', () => {
      page.feedList()[1].click()
      scope.$digest()

      expect(ngReduxMock.getActions()[0]).toContainObject({
        type: 'ROUTE_CHANGED',
        route: ['admin', 'feed-detail'],
        query: {uuid: 2}
      })
    })

    it('should filter feeds', () => {
      givenState({query: {q: 'title 1'}})
      expect(page.feedList().length).toEqual(1)
      expect(page.feedList()[0].title().textContent).toEqual('title 1')

      givenState({query: {q: 'title 2'}})
      expect(page.feedList().length).toEqual(1)
      expect(page.feedList()[0].title().textContent).toEqual('title 2')
    })

    it('should clear filter', () => {
      givenState({query: {q: 'title 1'}})
      expect(page.feedList().length).toEqual(1)

      givenState({query: {}})
      expect(page.feedList().length).toEqual(2)
    })
  })

  describe('', () => {

    let listPage

    beforeEach(() => {
      listPage = componentMock('myListPage')
      angular.mock.module('myreader', listPage, mockNgRedux())
    })

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
      scope = $rootScope.$new(true)
      ngReduxMock = $ngRedux

      ngReduxMock.setState({admin: {feeds}})

      element = $compile('<my-feed-list></my-feed-list>')(scope)
      page = PageObject(element)
      scope.$digest()
    }))

    it('should update url when search executed', () => {
      listPage.bindings.myOnSearch({params: {q: 'b'}})
      scope.$digest()

      expect(ngReduxMock.getActions()[0]).toContainObject({
        type: 'ROUTE_CHANGED',
        route: ['admin', 'feed'],
        query: {q: 'b'}
      })
    })

    it('should refresh state', () => {
      listPage.bindings.myOnRefresh()
      scope.$digest()

      expect(ngReduxMock.getActionTypes()).toEqual(['GET_FEEDS'])
    })
  })
})
