import {componentMock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/feed/feed.component.spec.js', () => {

    let scope, $timeout, page, ngReduxMock, feed

    const PageObject = el => {
        const _title = () => el.querySelectorAll('input')[0]
        const _url = () => el.querySelectorAll('input')[1]
        const _validationErrorText = validationEl => validationEl.querySelector('div > div').textContent

        return {
            title: () =>_title(),
            url: () => _url(),
            feedUrlLink: () => el.querySelector('a'),
            enterTitle: value => {
                _title().value = value
                _title().dispatchEvent(new Event('input'))
                scope.$digest()
            },
            enterUrl: value => {
                _url().value = value
                _url().dispatchEvent(new Event('input'))
                scope.$digest()
            },
            titleValidationErrorText: () => _validationErrorText(el.querySelectorAll('my-validation-message')[0]),
            urlValidationErrorText: () => _validationErrorText(el.querySelectorAll('my-validation-message')[1]),
            clickSaveButton: () => el.querySelectorAll('button')[0].click(),
            clickDeleteButton: () => el.querySelectorAll('button')[1].click(),
            clickYesButton: () => el.querySelectorAll('button')[1].click(),
        }
    }

    const givenState = (selectedFeed = {}) => {
        ngReduxMock.setState({admin: {selectedFeed}})
        scope.$digest()
    }

    beforeEach(angular.mock.module('myreader', componentMock('myFeedFetchError'), mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux, _$timeout_) => {
        $timeout = _$timeout_
        scope = $rootScope.$new(true)
        ngReduxMock = $ngRedux

        feed = {
            uuid: 'expected uuid',
            title: 'expected title',
            url: 'expected url',
            other: 'other field'
        }

        const element = $compile('<my-feed></my-feed>')(scope)
        page = new PageObject(element[0])
        scope.$digest()
    }))

    it('should render title and url', () => {
        givenState(feed)

        expect(page.title().value).toEqual(feed.title)
        expect(page.url().value).toEqual(feed.url)
    })

    it('should save feed when save button clicked', () => {
        givenState(feed)

        page.enterTitle('updated title')
        page.enterUrl('updated url')
        page.clickSaveButton()

        expect(ngReduxMock.getActions()[0]).toEqualActionType('PATCH_FEED')
        expect(ngReduxMock.getActions()[0]).toContainActionData({body: {title: 'updated title', url: 'updated url'}})
    })

    it('should render validation messages', done => {
        jest.useRealTimers()
        ngReduxMock.dispatch.mockRejectedValueOnce({
            status: 400,
            data: {fieldErrors: [
                    {"field":"url","message":"expected url error"},
                    {"field":"title","message": "expected title error"}
                ]
            }
        })

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
        $timeout.flush(250)
        page.clickYesButton()

        expect(ngReduxMock.getActions()[0]).toEqualActionType('DELETE_FEED')
        expect(ngReduxMock.getActions()[0].url).toContain('/feeds/expected uuid')
    })

    it('should open url safely', () => {
        givenState(feed)
        const link = page.feedUrlLink()

        expect(link.attributes['ng-href'].value).toEqual('expected url')
        expect(link.attributes['target'].value).toEqual('_blank')
        expect(link.attributes['rel'].value).toEqual('noopener noreferrer')
    })
})
