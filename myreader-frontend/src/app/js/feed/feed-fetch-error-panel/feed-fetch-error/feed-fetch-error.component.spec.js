import {componentMock, mock} from 'shared/test-utils'

describe('src/app/js/feed/feed-fetch-error-panel/feed-fetch-error/feed-fetch-error.component.spec.js', () => {

    describe('controller', () => {

        let component, feedFetchErrorService

        beforeEach(angular.mock.module('myreader'))

        beforeEach(inject(($componentController, $q) => {
            feedFetchErrorService = jasmine.createSpyObj('feedFetchErrorService', ['findByFeedId'])
            feedFetchErrorService.findByFeedId.and.returnValue($q.defer().promise)
            component = $componentController('myFeedFetchError', {feedFetchErrorService: feedFetchErrorService})
        }))

        it('should not fetch errors when myId is undefined', () => {
            component.$onChanges({myId: {currentValue: undefined}})

            expect(feedFetchErrorService.findByFeedId).not.toHaveBeenCalled()
        })

        it('should fetch errors when myId is defined', () => {
            component.$onChanges({myId: {currentValue: 1}})

            expect(feedFetchErrorService.findByFeedId).toHaveBeenCalledWith(1)
        })

        it('should not fetch errors a second time when myId has not changed', () => {
            component.$onChanges({myId: {currentValue: 1}})
            component.$onChanges({myId: {currentValue: 1}})

            expect(feedFetchErrorService.findByFeedId).toHaveBeenCalledTimes(1)
        })

        it('should fetch errors when myId changed', () => {
            component.$onChanges({myId: {currentValue: 1}})
            component.$onChanges({myId: {currentValue: 2}})

            expect(feedFetchErrorService.findByFeedId).toHaveBeenCalledTimes(2)
            expect(feedFetchErrorService.findByFeedId.calls.argsFor(0)).toEqual([1])
            expect(feedFetchErrorService.findByFeedId.calls.argsFor(1)).toEqual([2])
        })
    })

    describe('with html', () => {

        const myFeedFetchErrorListItem = componentMock('myFeedFetchErrorListItem')
        const loadMore = componentMock('myLoadMore')

        let scope, element, feedFetchErrorService, findByFeedIdDeferred, findByLinkDeferred

        const noErrors = {
            next: () => { return 'next' },
            totalElements: 0,
            retainDays: 2,
            fetchError: []
        }

        const errors = {
            next: () => { return '/api/resource' },
            totalElements: 2,
            retainDays: 3,
            fetchError: [{id:1}]
        }

        const errorsMore = {
            next: () => { return '/api/resource?page1' },
            totalElements: 2,
            retainDays: 3,
            fetchError: [{id:2}]
        }

        beforeEach(angular.mock.module('myreader', myFeedFetchErrorListItem, loadMore, mock('feedFetchErrorService')))

        beforeEach(inject(($rootScope, $compile, $q, _feedFetchErrorService_) => {
            scope = $rootScope.$new(true)
            feedFetchErrorService = _feedFetchErrorService_

            feedFetchErrorService.findByFeedId = jasmine.createSpy('feedFetchErrorService.findByFeedId()')
            findByFeedIdDeferred = $q.defer()
            feedFetchErrorService.findByFeedId.and.returnValue(findByFeedIdDeferred.promise)

            feedFetchErrorService.findByLink = jasmine.createSpy('feedFetchErrorService.findByLink()')
            findByLinkDeferred = $q.defer()
            feedFetchErrorService.findByLink.and.returnValue(findByLinkDeferred.promise)

            scope.onError = jasmine.createSpy('onError()')

            element = $compile('<my-feed-fetch-error my-id="id" my-on-error="onError(error)"></my-feed-fetch-error>')(scope)
            scope.$digest()
        }))

        it('should initially show text "no errors"', () => {
            expect(element.find('p').length).toEqual(1)
            expect(element.find('p')[0].innerText).toContain('no errors')
        })

        it('should show text "loading..." while fetching errors', () => {
            scope.id = 1
            scope.$digest()

            expect(feedFetchErrorService.findByFeedId).toHaveBeenCalledWith(1)
            expect(element.find('p').length).toEqual(1)
            expect(element.find('p')[0].innerText).toContain('loading...')
        })

        it('should show text "no errors" when service returned no errors', () => {
            findByFeedIdDeferred.resolve(noErrors)
            scope.id = 1
            scope.$digest()

            expect(element.find('p').length).toEqual(1)
            expect(element.find('p')[0].innerText).toContain('no errors')
        })

        it('should show detail information', () => {
            findByFeedIdDeferred.resolve(errors)
            scope.id = 1
            scope.$digest()

            expect(element.find('p').length).toEqual(1)
            expect(element.find('p')[0].innerText).toContain('2 error(s) in the last 3 day(s)')
        })

        it('should render error items with feed fetch error list item component', () => {
            findByFeedIdDeferred.resolve(errors)
            scope.id = 1
            scope.$digest()

            expect(myFeedFetchErrorListItem.bindings.myItem).toEqual(jasmine.objectContaining({id: 1}))
        })

        it('should render all errors', () => {
            errors.fetchError.push({id: 2})
            findByFeedIdDeferred.resolve(errors)
            scope.id = 1
            scope.$digest()

            expect(element.find('my-feed-fetch-error-list-item').length).toEqual(2)
        })

        it('should delegate next link to load more component', () => {
            findByFeedIdDeferred.resolve(errors)
            findByLinkDeferred.resolve(errors)
            scope.id = 1
            scope.$digest()

            expect(loadMore.bindings.myNext).toEqual('/api/resource')
        })

        it('should delegate new next link to load more component', () => {
            findByFeedIdDeferred.resolve(errors)
            scope.id = 1
            scope.$digest()

            loadMore.bindings.myOnMore({more: 'more'})
            findByLinkDeferred.resolve(errorsMore)
            scope.$digest()

            expect(loadMore.bindings.myNext).toEqual('/api/resource?page1')
        })

        it('should trigger onError() when fetching errors failed', () => {
            scope.id = 1
            scope.$digest()
            findByFeedIdDeferred.reject('expected error')
            scope.$digest()

            expect(scope.onError).toHaveBeenCalledWith('expected error')
        })

        it('should trigger onError() when fetching more errors failed', () => {
            findByFeedIdDeferred.resolve(errors)
            scope.id = 1
            scope.$digest()

            loadMore.bindings.myOnMore({more: 'more'})
            findByLinkDeferred.reject('expected error')
            scope.$digest()

            expect(scope.onError).toHaveBeenCalledWith('expected error')
        })
    })
})
