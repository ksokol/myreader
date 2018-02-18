import {componentMock, mockNgRedux} from 'shared/test-utils'

describe('src/app/js/feed/feed.component.spec.js', () => {

    let scope, element, page, ngReduxMock, feed

    const PageObject = el => {
        const _title = () => angular.element(el.find('input')[0])
        const _url = () => angular.element(el.find('input')[1])
        const _validationErrorText = validationEl => {
            const firstDiv = angular.element(angular.element(validationEl).find('div'))
            return firstDiv.find('div')[0].innerText
        }

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
        }
    }

    const givenState = (selectedFeed = {}) => {
        ngReduxMock.setState({admin: {selectedFeed}})
        scope.$digest()
    }

    beforeEach(angular.mock.module('myreader', componentMock('myFeedFetchError'), mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        jasmine.clock().uninstall()

        scope = $rootScope.$new(true)
        ngReduxMock = $ngRedux

        feed = {
            uuid: 'expected uuid',
            title: 'expected title',
            url: 'expected url',
            other: 'other field'
        }

        element = $compile('<my-feed></my-feed>')(scope)
        page = new PageObject(element)
        scope.$digest()
    }))

    it('should render title and url', () => {
        givenState(feed)

        expect(page.title().val()).toEqual(feed.title)
        expect(page.url().val()).toEqual(feed.url)
    })

    it('should save feed when save button clicked', () => {
        givenState(feed)

        page.enterTitle('updated title')
        page.enterUrl('updated url')
        page.clickSaveButton()

        expect(ngReduxMock.getActions()[0]).toEqualActionType('PATCH_FEED')
        expect(ngReduxMock.getActions()[0]).toContainActionData({body: {title: 'updated title', url: 'updated url'}})
    })

    it('should render success notification when feed persisted', done => {
        givenState(feed)
        page.clickSaveButton()

        setTimeout(() => {
            expect(ngReduxMock.getActionTypes()).toEqual(['PATCH_FEED', 'SHOW_NOTIFICATION'])
            expect(ngReduxMock.getActions()[0]).toContainActionData({body: {title: 'expected title', url: 'expected url'}})
            expect(ngReduxMock.getActions()[1]).toContainActionData({notification: {text: 'Feed saved', type: 'success'}})
            done()
        })
    })

    it('should render error notification when feed could not be deleted', done => {
        ngReduxMock.dispatch.and.returnValue(Promise.reject({status: 409}))

        page.clickSaveButton()

        setTimeout(() => {
            ngReduxMock.dispatch.calls.allArgs()[1][0](ngReduxMock.dispatch, () => {return {common: {notification: {nextId: 0}}}})

            expect(ngReduxMock.dispatch.calls.allArgs()[2][0])
                .toContainObject({type: 'SHOW_NOTIFICATION', notification: {text: 'Can not delete. Feed has subscriptions', type: 'error'}})

            done()
        })
    })

    it('should render validation messages', done => {
        ngReduxMock.dispatch.and.returnValue(Promise.reject({
            status: 400,
            data: {fieldErrors: [
                    {"field":"url","message":"expected url error"},
                    {"field":"title","message": "expected title error"}
                ]
            }
        }))

        page.clickSaveButton()

        setTimeout(() => {
            scope.$digest()
            expect(page.titleValidationErrorText()).toEqual('expected title error')
            expect(page.urlValidationErrorText()).toEqual('expected url error')
            done()
        })
    })

    it('should delete feed', () => {
        givenState(feed)

        page.clickDeleteButton()
        page.clickYesButton()

        expect(ngReduxMock.getActions()[0]).toEqualActionType('DELETE_FEED')
        expect(ngReduxMock.getActions()[0].url).toContain('/feeds/expected uuid')
        expect(ngReduxMock.getActions()[1]).toContainObject({type: 'ROUTE_CHANGED', route: ['admin', 'feed']})
    })

    it('should open url safely', () => {
        givenState(feed)
        const link = page.feedUrlLink()

        expect(link.attributes['ng-href'].value).toEqual('expected url')
        expect(link.attributes['target'].value).toEqual('_blank')
        expect(link.attributes['rel'].value).toEqual('noopener noreferrer')
    })
})
