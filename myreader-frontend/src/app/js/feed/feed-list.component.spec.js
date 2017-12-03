import {componentMock, mock, filterMock, mockNgRedux} from '../shared/test-utils';

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
    }];

    const currentState = {
        common: {
            notification: {
                nextId: 1
            }
        }
    };

    const mySearchInput = componentMock('mySearchInput');

    let rootScope, scope, element, page, $state, ngRedux, feedService, feed, findAllDeferred;

    const Feed = el => {
        return {
            title: () => el.find('h3')[0],
            createdAt: () => el.find('p')[0],
            errorIcon: () => {
                const item = el.find('my-icon')[0];
                return item ? angular.element(item) : undefined;
            },
            click: () => angular.element(el.find('button')[0]).triggerHandler('click')
        }
    };

    const PageObject = el => {
        return {
            feedList: () => {
                const feeds = [];
                const items = el.find('md-list-item');
                for (let i=0; i < items.length; i++) {
                    feeds.push(new Feed(angular.element(items[i])));
                }
                return feeds;
            }
        }
    };

    beforeEach(angular.mock.module('myreader', mock('$state'), mock('feedService'), filterMock('timeago'), mySearchInput, mockNgRedux()));

    beforeEach(inject(($rootScope, $compile, $q, _$state_, $ngRedux, _feedService_) => {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        ngRedux = $ngRedux;

        feed = {
            uuid: 'expected uuid',
            title: 'expected title',
            url: 'expected url',
            other: 'other field'
        };

        findAllDeferred = $q.defer();

        feedService = _feedService_;
        feedService.findAll = jasmine.createSpy('subscriptionService.findAll()');
        feedService.findAll.and.returnValue(findAllDeferred.promise);

        $state = _$state_;
        $state.go = jasmine.createSpy('$state.go()');

        element = $compile('<my-feed-list></my-feed-list>')(scope);
        page = new PageObject(element);
        scope.$digest();

        findAllDeferred.resolve(feeds);
        scope.$digest();
    }));

    it('should show error when feed fetch failed', inject(($compile, $q) => {
        findAllDeferred = $q.defer();
        feedService.findAll.and.returnValue(findAllDeferred.promise);
        element = $compile('<my-feed-list></my-feed-list>')(scope);
        page = new PageObject(element);
        findAllDeferred.reject('expected error');
        scope.$digest();

        ngRedux.thunk(currentState);
        expect(ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            type: 'SHOW_NOTIFICATION',
            notification: jasmine.objectContaining({text: 'expected error', type: 'error'})
        }));
    }));

    it('should show feed items', () => {
        expect(page.feedList()[0].title().innerText).toEqual('title 1');
        expect(page.feedList()[1].title().innerText).toEqual('title 2');
    });

    it('should sanitize feed title', () => {
        expect(page.feedList()[0].title().classList).toContain('ng-binding');
    });

    it('should show error icon when feed err', () => {
        expect(page.feedList()[0].errorIcon()).toBeUndefined();
        expect(page.feedList()[1].errorIcon()).toBeDefined();
    });

    it('should render error icon when feed err', () => {
        expect(page.feedList()[1].errorIcon().attr('my-type')).toEqual('error');
    });

    it('should pass feed creation date to timeago pipe', () => {
        expect(page.feedList()[0].createdAt().innerText).toContain('timeago("createdAt 1")');
    });

    it('should navigate to feed detail page', () => {
        page.feedList()[1].click();

        expect($state.go).toHaveBeenCalledWith('admin.feed-detail', {uuid: 2});
    });

    it('should filter feeds', () => {
        mySearchInput.bindings.myOnChange({ value: 'title 1'});
        scope.$digest();

        expect(page.feedList().length).toEqual(1);
        expect(page.feedList()[0].title().innerText).toEqual('title 1');

        mySearchInput.bindings.myOnChange({ value: 'title 2'});
        scope.$digest();

        expect(page.feedList().length).toEqual(1);
        expect(page.feedList()[0].title().innerText).toEqual('title 2');
    });

    it('should clear filter', () => {
        mySearchInput.bindings.myOnChange({ value: 'title 1'});
        scope.$digest();

        expect(page.feedList().length).toEqual(1);

        mySearchInput.bindings.myOnClear();
        scope.$digest();

        expect(page.feedList().length).toEqual(2);
    });
});
