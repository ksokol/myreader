describe('src/app/js/feed/feed.component.spec.js', function () {

    describe('with html', function () {

        var testUtils = require('../shared/test-utils');

        var mySafeOpener = testUtils.directiveMock('mySafeOpener');
        var myFeedFetchErrorPanel = testUtils.componentMock('myFeedFetchErrorPanel');

        var scope, element, page, $state, $stateParams, feedService, feed, findOneDeferred, saveDeferred, removeDeferred;

        var PageObject = function (el) {

            var _title = function () {
                return angular.element(el.find('input')[0]);
            };

            var _url = function () {
                return angular.element(el.find('input')[1]);
            };

            var _validationErrorText = function (validationEl) {
                var firstDiv = angular.element(angular.element(validationEl).find('div'));
                return firstDiv.find('div')[0].innerText;
            };

            return {
                title: function () {
                    return _title();
                },
                url: function () {
                    return _url();
                },
                enterTitle: function (value) {
                    _title().val(value).triggerHandler('input');
                },
                enterUrl: function (value) {
                    _url().val(value).triggerHandler('input');
                },
                titleValidationErrorText: function () {
                    return _validationErrorText(element.find('my-validation-message')[0]);
                },
                urlValidationErrorText: function () {
                    return _validationErrorText(element.find('my-validation-message')[1]);
                },
                clickSaveButton: function () {
                    angular.element(element.find('button')[0]).triggerHandler('click');
                },
                clickDeleteButton: function () {
                    angular.element(element.find('button')[1]).triggerHandler('click');
                },
                clickYesButton: function () {
                    angular.element(element.find('button')[1]).triggerHandler('click');
                },
                notificationText: function () {
                    return element.find('my-notification-panel').find('span')[0].innerText;
                }
            }
        };

        beforeEach(require('angular').mock.module('myreader',
            testUtils.mock('$state'),
            testUtils.mock('$stateParams'),
            testUtils.mock('feedService'),
            mySafeOpener,
            myFeedFetchErrorPanel
        ));

        beforeEach(inject(function ($rootScope, $compile, $q, _$state_, _$stateParams_, _feedService_) {
            scope = $rootScope.$new();

            feed = {
                uuid: 'expected uuid',
                title: 'expected title',
                url: 'expected url',
                other: 'other field'
            };

            saveDeferred = $q.defer();
            removeDeferred = $q.defer();
            findOneDeferred = $q.defer();

            feedService = _feedService_;
            feedService.findOne = jasmine.createSpy('subscriptionService.findOne()');
            feedService.save = jasmine.createSpy('subscriptionService.save()');
            feedService.remove = jasmine.createSpy('subscriptionService.remove()');
            feedService.findOne.and.returnValue(findOneDeferred.promise);
            feedService.save.and.returnValue(saveDeferred.promise);
            feedService.remove.and.returnValue(removeDeferred.promise);

            $state = _$state_;
            $state.go = jasmine.createSpy('$state.go()');

            $stateParams = _$stateParams_;
            $stateParams.uuid = feed.uuid;

            element = $compile('<my-feed></my-feed>')(scope);
            page = new PageObject(element);
            scope.$digest();
        }));

        it('should fetch feed on init', function () {
            expect(feedService.findOne).toHaveBeenCalledWith('expected uuid');
        });

        it('should initialize child components', function () {
            findOneDeferred.resolve(feed);
            scope.$digest();

            expect(mySafeOpener.scope.ctrl.url).toEqual('expected url');
            expect(myFeedFetchErrorPanel.bindings.myId).toEqual('expected uuid');
        });

        it('should render error message when feed could not be fetched on init', function () {
            findOneDeferred.reject('expected error');
            scope.$digest();

            expect(page.notificationText()).toEqual('expected error');
        });

        it('should render title and url', function () {
            findOneDeferred.resolve(feed);
            scope.$digest();

            expect(page.title().val()).toEqual(feed.title);
            expect(page.url().val()).toEqual(feed.url);
        });

        it('should save feed when save button clicked', function () {
            findOneDeferred.resolve(feed);
            scope.$digest();

            page.enterTitle('updated title');
            page.enterUrl('updated url');
            page.clickSaveButton();

            expect(feedService.save).toHaveBeenCalledWith({
                uuid: 'expected uuid',
                title: 'updated title',
                url: 'updated url',
                other: 'other field'
            });
        });

        it('should render success notification when feed persisted', function () {
            page.clickSaveButton();
            saveDeferred.resolve();
            scope.$digest();

            expect(page.notificationText()).toEqual('saved');
        });

        it('should render error notification when feed persist failed', function () {
            page.clickSaveButton();
            saveDeferred.reject({data: 'expected error'});
            scope.$digest();

            expect(page.notificationText()).toEqual('expected error');
        });

        it('should render error notification when feed could not be deleted', function () {
            page.clickSaveButton();
            saveDeferred.reject({status: 409});
            scope.$digest();

            expect(page.notificationText()).toEqual('abort. Feed has subscriptions');
        });

        it('should render validation messages', function() {
            page.clickSaveButton();
            saveDeferred.reject({
                status: 400,
                data: {fieldErrors: [
                        {"field":"url","message":"expected url error"},
                        {"field":"title","message": "expected title error"}
                    ]
                }
            });
            scope.$digest();

            expect(page.titleValidationErrorText()).toEqual('expected title error');
            expect(page.urlValidationErrorText()).toEqual('expected url error');
        });

        it('should delete feed', function() {
            findOneDeferred.resolve(feed);
            scope.$digest();

            page.clickDeleteButton();
            page.clickYesButton();
            removeDeferred.resolve();
            scope.$digest();

            expect($state.go).toHaveBeenCalledWith('admin.feed');
            expect(feedService.remove).toHaveBeenCalledWith({
                uuid: 'expected uuid',
                title: 'expected title',
                url: 'expected url',
                other: 'other field'
            });
        });

        it('should render error notification when feed delete failed', function() {
            page.clickDeleteButton();
            page.clickYesButton();
            removeDeferred.reject({data: 'expected error'});
            scope.$digest();

            expect(page.notificationText()).toEqual('expected error');
        });
    });
});
