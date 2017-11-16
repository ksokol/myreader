import {componentMock, mock} from '../shared/test-utils';

describe('src/app/js/feed/feed.component.spec.js', () => {

    const myFeedFetchErrorPanel = componentMock('myFeedFetchErrorPanel');

    let scope, element, page, $state, $stateParams, feedService, feed, findOneDeferred, saveDeferred, removeDeferred;

    const PageObject = el => {

        const _title = () => angular.element(el.find('input')[0]);

        const _url = () => angular.element(el.find('input')[1]);

        const _validationErrorText = validationEl => {
            const firstDiv = angular.element(angular.element(validationEl).find('div'));
            return firstDiv.find('div')[0].innerText;
        };

        return {
            title: () =>_title(),

            url: () => _url(),

            feedUrlLink: () => el.find('a')[0],

            enterTitle: value => _title().val(value).triggerHandler('input'),

            enterUrl: value => _url().val(value).triggerHandler('input'),

            titleValidationErrorText: () => _validationErrorText(element.find('my-validation-message')[0]),

            urlValidationErrorText: () => _validationErrorText(element.find('my-validation-message')[1]),

            clickSaveButton: () => angular.element(element.find('button')[0]).triggerHandler('click'),

            clickDeleteButton: () => angular.element(element.find('button')[1]).triggerHandler('click'),

            clickYesButton: () => angular.element(element.find('button')[1]).triggerHandler('click'),

            notificationText: () => element.find('my-notification-panel').find('span')[0].innerText
        }
    };

    beforeEach(angular.mock.module('myreader', mock('$state'), mock('$stateParams'), mock('feedService'), myFeedFetchErrorPanel));

    beforeEach(inject(($rootScope, $compile, $q, _$state_, _$stateParams_, _feedService_) => {
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

    it('should fetch feed on init', () => {
        expect(feedService.findOne).toHaveBeenCalledWith('expected uuid');
    });

    it('should initialize child components', () => {
        findOneDeferred.resolve(feed);
        scope.$digest();

        expect(myFeedFetchErrorPanel.bindings.myId).toEqual('expected uuid');
    });

    it('should render error message when feed could not be fetched on init', () => {
        findOneDeferred.reject('expected error');
        scope.$digest();

        expect(page.notificationText()).toEqual('expected error');
    });

    it('should render title and url', () => {
        findOneDeferred.resolve(feed);
        scope.$digest();

        expect(page.title().val()).toEqual(feed.title);
        expect(page.url().val()).toEqual(feed.url);
    });

    it('should save feed when save button clicked', () => {
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

    it('should render success notification when feed persisted', () => {
        page.clickSaveButton();
        saveDeferred.resolve();
        scope.$digest();

        expect(page.notificationText()).toEqual('saved');
    });

    it('should render error notification when feed persist failed', () => {
        page.clickSaveButton();
        saveDeferred.reject({data: 'expected error'});
        scope.$digest();

        expect(page.notificationText()).toEqual('expected error');
    });

    it('should render error notification when feed could not be deleted', () => {
        page.clickSaveButton();
        saveDeferred.reject({status: 409});
        scope.$digest();

        expect(page.notificationText()).toEqual('abort. Feed has subscriptions');
    });

    it('should render validation messages', () => {
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

    it('should delete feed', () => {
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

    it('should render error notification when feed delete failed', () => {
        page.clickDeleteButton();
        page.clickYesButton();
        removeDeferred.reject({data: 'expected error'});
        scope.$digest();

        expect(page.notificationText()).toEqual('expected error');
    });

    it('should open url safely', () => {
        findOneDeferred.resolve(feed);
        scope.$digest();
        const link = page.feedUrlLink();

        expect(link.attributes['ng-href'].value).toEqual('expected url');
        expect(link.attributes['target'].value).toEqual('_blank');
        expect(link.attributes['rel'].value).toEqual('noopener noreferrer');
    });
});
