describe('src/app/js/feed/feed-list.component.spec.js', function () {

    describe('with html', function () {

        var feeds = [{
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

        var testUtils = require('../shared/test-utils');

        var mySearchInput = testUtils.componentMock('mySearchInput');

        var rootScope, scope, element, page, $state, feedService, feed, findAllDeferred;

        var Feed = function (el) {
            return {
                title: function () {
                    return el.find('h3')[0];
                },
                createdAt: function () {
                    return el.find('p')[0];
                },
                errorIcon: function () {
                    var item = el.find('my-icon')[0];
                    return item ? angular.element(item) : undefined;
                },
                click: function () {
                    angular.element(el.find('button')[0]).triggerHandler('click');
                }
            }
        };

        var PageObject = function (el) {
            return {
                notificationText: function () {
                    return el.find('my-notification-panel').find('span')[0].innerText;
                },
                feedList: function () {
                    var feeds = [];
                    var items = el.find('md-list-item');
                    for (var i=0; i < items.length; i++) {
                        feeds.push(new Feed(angular.element(items[i])));
                    }
                    return feeds;
                }
            }
        };

        beforeEach(require('angular').mock.module(
            'myreader',
            testUtils.mock('$state'),
            testUtils.mock('feedService'),
            testUtils.filterMock('timeago'),
            mySearchInput
        ));

        beforeEach(inject(function ($rootScope, $compile, $q, _$state_, _feedService_) {
            rootScope = $rootScope;
            scope = $rootScope.$new();

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

        it('should show error when feed fetch failed', inject(function ($compile, $q) {
            findAllDeferred = $q.defer();
            feedService.findAll.and.returnValue(findAllDeferred.promise);
            element = $compile('<my-feed-list></my-feed-list>')(scope);
            page = new PageObject(element);
            findAllDeferred.reject('expected error');
            scope.$digest();

            expect(page.notificationText()).toEqual('expected error');
        }));

        it('should show feed items', function () {
            expect(page.feedList()[0].title().innerText).toEqual('title 1');
            expect(page.feedList()[1].title().innerText).toEqual('title 2');
        });

        it('should sanitize feed title', function () {
            expect(page.feedList()[0].title().classList).toContain('ng-binding');
        });

        it('should show error icon when feed err', function () {
            expect(page.feedList()[0].errorIcon()).toBeUndefined();
            expect(page.feedList()[1].errorIcon()).toBeDefined();
        });

        it('should render error icon when feed err', function () {
            expect(page.feedList()[1].errorIcon().attr('my-type')).toEqual('error');
        });

        it('should pass feed creation date to timeago pipe', function () {
            expect(page.feedList()[0].createdAt().innerText).toContain('timeago("createdAt 1")');
        });

        it('should navigate to feed detail page', function () {
            page.feedList()[1].click();

            expect($state.go).toHaveBeenCalledWith('admin.feed-detail', {uuid: 2});
        });

        it('should filter feeds', function () {
            mySearchInput.bindings.myOnChange({ value: 'title 1'});
            scope.$digest();

            expect(page.feedList().length).toEqual(1);
            expect(page.feedList()[0].title().innerText).toEqual('title 1');

            mySearchInput.bindings.myOnChange({ value: 'title 2'});
            scope.$digest();

            expect(page.feedList().length).toEqual(1);
            expect(page.feedList()[0].title().innerText).toEqual('title 2');
        });

        it('should clear filter', function () {
            mySearchInput.bindings.myOnChange({ value: 'title 1'});
            scope.$digest();

            expect(page.feedList().length).toEqual(1);

            mySearchInput.bindings.myOnClear();
            scope.$digest();

            expect(page.feedList().length).toEqual(2);
        });
    });
});
