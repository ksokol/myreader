import {componentMock, mockNgRedux, filterMock} from 'shared/test-utils'

describe('src/app/js/feed/feed-fetch-error/feed-fetch-error.component.spec.js', () => {

    let scope, element, ngReduxMock, loadMore

    const givenState = (fetchFailures = {}) => {
        ngReduxMock.setState({admin: {fetchFailures}})
        scope.$digest()
    }

    beforeEach(() => {
        loadMore = componentMock('myLoadMore')
        angular.mock.module('myreader', loadMore, filterMock('timeago'), mockNgRedux())
    })

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        scope = $rootScope.$new(true)
        ngReduxMock = $ngRedux

        element = $compile('<my-feed-fetch-error></my-feed-fetch-error>')(scope)
        scope.$digest()
    }))

    it('should show text "no errors" when feed has no fetch failures', () => {
        givenState()

        expect(element.find('p').length).toEqual(1)
        expect(element.find('p')[0].innerText).toContain('no errors')
    })

    it('should pass next link to load more component', () => {
        givenState({failures: [{}], links: {next: {path: '/api/resource'}}})

        expect(loadMore.bindings.myNext).toEqual({path: '/api/resource'})
    })

    it('should fetch next page when load more button clicked', () => {
        givenState({failures: [{}]})
        loadMore.bindings.myOnMore({more: {path: '/api/resource', query: {page: '1'}}})

        expect(ngReduxMock.getActionTypes()).toEqual(['GET_FEED_FETCH_FAILURES'])
        expect(ngReduxMock.getActions()[0]).toContainActionData({url: '/api/resource?page=1'})
    })

    it('should render message', () => {
        givenState({failures: [{uuid: 1, message: 'error1'}]})

        expect(element.find('span')[0].innerText).toEqual('error1')
    })

    it('should render createdAt', () => {
        givenState({failures: [{uuid: 1, createdAt: '2017-04-28T18:01:03Z'}]})

        expect(element.find('span')[1].innerText).toEqual('timeago("2017-04-28T18:01:03Z")')
    })

    it('should render all errors', () => {
        givenState({failures: [{uuid: 1}, {uuid: 2}]})

        expect(element[0].querySelectorAll('.feed-fetch-error__item').length).toEqual(2)
    })
})
