describe('src/app/js/feed/feed-fetch-error-panel/feed-fetch-error/feed-fetch-error.component.spec.js', function () {

    describe('controller', function () {

        var component, feedFetchErrorService;

        beforeEach(require('angular').mock.module('myreader'));

        beforeEach(inject(function ($componentController, $q) {
            feedFetchErrorService = jasmine.createSpyObj('feedFetchErrorService', ['findByFeedId']);
            feedFetchErrorService.findByFeedId.and.returnValue($q.defer().promise);
            component = $componentController('myFeedFetchError', {feedFetchErrorService: feedFetchErrorService});
        }));

        it('should not fetch errors when myId is undefined', function () {
            component.$onChanges({myId: {currentValue: undefined}});

            expect(feedFetchErrorService.findByFeedId).not.toHaveBeenCalled();
        });

        it('should fetch errors when myId is defined', function () {
            component.$onChanges({myId: {currentValue: 1}});

            expect(feedFetchErrorService.findByFeedId).toHaveBeenCalledWith(1);
        });

        it('should not fetch errors a second time when myId has not changed', function () {
            component.$onChanges({myId: {currentValue: 1}});
            component.$onChanges({myId: {currentValue: 1}});

            expect(feedFetchErrorService.findByFeedId).toHaveBeenCalledTimes(1);
        });

        it('should fetch errors when myId changed', function () {
            component.$onChanges({myId: {currentValue: 1}});
            component.$onChanges({myId: {currentValue: 2}});

            expect(feedFetchErrorService.findByFeedId).toHaveBeenCalledTimes(2);
            expect(feedFetchErrorService.findByFeedId.calls.argsFor(0)).toEqual([1]);
            expect(feedFetchErrorService.findByFeedId.calls.argsFor(1)).toEqual([2]);
        });
    });

    describe('with html', function () {

        var testUtils = require('../../../shared/test-utils');

        var myFeedFetchErrorListItem = testUtils.componentMock('myFeedFetchErrorListItem');
        var loadMore = testUtils.componentMock('myLoadMore');

        var scope, element, feedFetchErrorService, findByFeedIdDeferred, findByLinkDeferred;

        var noErrors = {
            next: function () { return 'next'; },
            totalElements: 0,
            retainDays: 2,
            fetchError: []
        };

        var errors = {
            next: function () { return '/api/resource'; },
            totalElements: 2,
            retainDays: 3,
            fetchError: [{id:1}]
        };

        var errorsMore = {
            next: function () { return '/api/resource?page1'; },
            totalElements: 2,
            retainDays: 3,
            fetchError: [{id:2}]
        };

        beforeEach(require('angular')
            .mock.module('myreader',
                         myFeedFetchErrorListItem,
                         loadMore,
                         testUtils.mock('feedFetchErrorService')
            ));

        beforeEach(inject(function ($rootScope, $compile, $q, _feedFetchErrorService_) {
            scope = $rootScope.$new();
            feedFetchErrorService = _feedFetchErrorService_;

            feedFetchErrorService.findByFeedId = jasmine.createSpy('feedFetchErrorService.findByFeedId()');
            findByFeedIdDeferred = $q.defer();
            feedFetchErrorService.findByFeedId.and.returnValue(findByFeedIdDeferred.promise);

            feedFetchErrorService.findByLink = jasmine.createSpy('feedFetchErrorService.findByLink()');
            findByLinkDeferred = $q.defer();
            feedFetchErrorService.findByLink.and.returnValue(findByLinkDeferred.promise);

            scope.onError = jasmine.createSpy('onError()');

            element = $compile('<my-feed-fetch-error my-id="id" my-on-error="onError(error)"></my-feed-fetch-error>')(scope);
            scope.$digest();
        }));

        it('should initially show text "no errors"', function () {
            expect(element.find('p').length).toEqual(1);
            expect(element.find('p')[0].innerText).toContain('no errors');
        });

        it('should show text "loading..." while fetching errors', function () {
            scope.id = 1;
            scope.$digest();

            expect(feedFetchErrorService.findByFeedId).toHaveBeenCalledWith(1);
            expect(element.find('p').length).toEqual(1);
            expect(element.find('p')[0].innerText).toContain('loading...');
        });

        it('should show text "no errors" when service returned no errors', function () {
            findByFeedIdDeferred.resolve(noErrors);
            scope.id = 1;
            scope.$digest();

            expect(element.find('p').length).toEqual(1);
            expect(element.find('p')[0].innerText).toContain('no errors');
        });

        it('should show detail information', function () {
            findByFeedIdDeferred.resolve(errors);
            scope.id = 1;
            scope.$digest();

            expect(element.find('p').length).toEqual(1);
            expect(element.find('p')[0].innerText).toContain('2 error(s) in the last 3 day(s)');
        });

        it('should render error items with feed fetch error list item component', function () {
            findByFeedIdDeferred.resolve(errors);
            scope.id = 1;
            scope.$digest();

            expect(myFeedFetchErrorListItem.bindings.myItem).toEqual(jasmine.objectContaining({id:1}));
        });

        it('should render all errors', function () {
            errors.fetchError.push({id:2});
            findByFeedIdDeferred.resolve(errors);
            scope.id = 1;
            scope.$digest();

            expect(element.find('my-feed-fetch-error-list-item').length).toEqual(2);
        });

        it('should delegate next link to load more component', function () {
            findByFeedIdDeferred.resolve(errors);
            findByLinkDeferred.resolve(errors);
            scope.id = 1;
            scope.$digest();

            expect(loadMore.bindings.myNext).toEqual('/api/resource');
        });

        it('should delegate new next link to load more component', function () {
            findByFeedIdDeferred.resolve(errors);
            scope.id = 1;
            scope.$digest();

            loadMore.bindings.myOnMore({more: 'more'});
            findByLinkDeferred.resolve(errorsMore);
            scope.$digest();

            expect(loadMore.bindings.myNext).toEqual('/api/resource?page1');
        });

        it('should trigger onError() when fetching errors failed', function () {
            findByFeedIdDeferred.reject('expected error');
            scope.id = 1;
            scope.$digest();

            expect(scope.onError).toHaveBeenCalledWith('expected error');
        });

        it('should trigger onError() when fetching more errors failed', function () {
            findByFeedIdDeferred.resolve(errors);
            scope.id = 1;
            scope.$digest();

            loadMore.bindings.myOnMore({more: 'more'});
            findByLinkDeferred.reject('expected error');
            scope.$digest();

            expect(scope.onError).toHaveBeenCalledWith('expected error');
        });
    });
});
