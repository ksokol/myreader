import {mockNgRedux, multipleReactComponents, reactComponent} from '../../shared/test-utils'

describe('FeedFetchErrorComponent', () => {

  let scope, element, ngReduxMock, loadMore, timeago

  const givenState = (fetchFailures = {}) => {
    ngReduxMock.setState({admin: {fetchFailures, fetchFailuresLoading: true}})
    scope.$digest()
  }

  beforeEach(() => {
    loadMore = reactComponent('FeedFetchErrorLoadMore')
    timeago = multipleReactComponents('TimeAgo')
    angular.mock.module('myreader', loadMore, timeago, mockNgRedux())
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    scope = $rootScope.$new(true)
    ngReduxMock = $ngRedux

    givenState({failures: [], links: {next: {path: '/api/resource', query: {page: 1}}}})
    element = $compile('<my-feed-fetch-error></my-feed-fetch-error>')(scope)
    scope.$digest()
  }))

  it('should pass properties to load more component', () => {
    expect(loadMore.bindings.disabled).toEqual(true)
  })

  it('should show text "no errors" when feed has no fetch failures', () => {
    expect(element.find('p').length).toEqual(1)
    expect(element.find('p')[0].textContent).toContain('no errors')
  })

  it('should fetch next page when load more button clicked', () => {
    loadMore.bindings.onClick()

    expect(ngReduxMock.getActionTypes()).toEqual(['GET_FEED_FETCH_FAILURES'])
    expect(ngReduxMock.getActions()[0]).toContainActionData({url: '/api/resource?page=1'})
  })

  it('should fetch next page when load more button is visible', () => {
    loadMore.bindings.onIntersection()

    expect(ngReduxMock.getActionTypes()).toEqual(['GET_FEED_FETCH_FAILURES'])
    expect(ngReduxMock.getActions()[0]).toContainActionData({url: '/api/resource?page=1'})
  })

  it('should render message', () => {
    givenState({failures: [{uuid: 1, message: 'error1'}]})

    expect(element.find('span')[0].textContent).toEqual('error1')
  })

  it('should render createdAt', () => {
    givenState({failures: [{uuid: 1, createdAt: '2017-04-28T18:01:03Z'}]})

    expect(timeago.bindings[0]).toEqual({date: '2017-04-28T18:01:03Z'})
  })

  it('should render all errors', () => {
    givenState({failures: [{uuid: 1}, {uuid: 2}]})

    expect(element[0].querySelectorAll('.feed-fetch-error__item').length).toEqual(2)
  })
})
