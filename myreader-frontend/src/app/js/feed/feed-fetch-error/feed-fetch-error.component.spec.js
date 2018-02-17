import {componentMock, mockNgRedux} from 'shared/test-utils'

describe('src/app/js/feed/feed-fetch-error/feed-fetch-error.component.spec.js', () => {

    const feedFetchErrorListItem = componentMock('myFeedFetchErrorListItem')
    const loadMore = componentMock('myLoadMore')

    let scope, element, ngReduxMock

    const givenState = (fetchFailures = {}, applicationInfo = {}) => {
        ngReduxMock.setState({admin: {fetchFailures, applicationInfo}})
        scope.$digest()
    }

    beforeEach(angular.mock.module('myreader', feedFetchErrorListItem, loadMore, mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new(true)
        ngReduxMock = $ngRedux

        element = $compile('<my-feed-fetch-error></my-feed-fetch-error>')(scope)
        scope.$digest()
    }))

    it('should show text "no errors" when feed has no fetch failures', () => {
        givenState({totalElements: 0})

        expect(element.find('p').length).toEqual(1)
        expect(element.find('p')[0].innerText).toContain('no errors')
    })

    it('should show detail information', () => {
        givenState({totalElements: 2}, {fetchErrorRetainDays: 3})

        expect(element.find('p').length).toEqual(1)
        expect(element.find('p')[0].innerText).toContain('2 error(s) in the last 3 day(s)')
    })

    it('should render error items with feed fetch error list item component', () => {
        givenState({failures: [{uuid: 1}], totalElements: 1})

        expect(feedFetchErrorListItem.bindings.myItem).toEqual(jasmine.objectContaining({uuid: 1}))
    })

    it('should render all errors', () => {
        givenState({failures: [{uuid: 1}, {uuid: 2}], totalElements: 1})

        expect(element.find('my-feed-fetch-error-list-item').length).toEqual(2)
    })

    it('should pass next link to load more component', () => {
        givenState({failures: [], links: {next: {path: '/api/resource'}}, totalElements: 1})

        expect(loadMore.bindings.myNext).toEqual({path: '/api/resource'})
    })

    it('should fetch next page when load more button clicked', () => {
        loadMore.bindings.myOnMore({more: {path: '/api/resource', query: {page: '1'}}})

        expect(ngReduxMock.getActionTypes()).toEqual(['GET_FEED_FETCH_FAILURES'])
        expect(ngReduxMock.getActions()[0]).toContainActionData({url: '/api/resource?page=1'})
    })
})
