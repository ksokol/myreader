import {mockNgRedux, componentMock, onKey, tick} from '../shared/test-utils'

const enter = {key: 'Enter', keyCode: 13}
const arrowDown = {key: 'ArrowDown', keyCode: 40}
const arrowUp = {key: 'ArrowUp', keyCode: 38}

describe('src/app/js/feed-stream/feed-stream.component.spec.js', () => {

    let scope, element, ngReduxMock

    const givenState = (entries = [], entryInFocus = '1', nextFocusableEntry = '2', mediaBreakpoint = 'desktop') => {
        ngReduxMock.setState({entry: {entries, entryInFocus, nextFocusableEntry}, common: {mediaBreakpoint}})
    }

    describe('', () => {

        beforeEach(angular.mock.module('myreader', mockNgRedux(), componentMock('myEntryList')))

        beforeEach(inject(($rootScope, $compile, $ngRedux) => {
            scope = $rootScope.$new(true)
            ngReduxMock = $ngRedux

            givenState([{uuid: '1'}, {uuid: '2'}], '1', '2')

            element = $compile('<my-feed-stream></my-feed-stream>')(scope)[0]
            scope.$digest()
        }))

        it('should focus previous entry when previous button clicked', () => {
            element.querySelectorAll('button')[0].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_FOCUS_PREVIOUS'])
        })

        it('should focus previous entry when arrow up key pressed', () => {
            jest.useFakeTimers() // TODO Remove me together with patched setTimeout function in app.module.js.
            onKey('down', arrowUp)
            tick()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_FOCUS_PREVIOUS'])
        })

        it('should focus next entry when next button clicked', () => {
            element.querySelectorAll('button')[1].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_FOCUS_NEXT'])
        })

        it('should focus next entry when arrow down key pressed', () => {
            jest.useFakeTimers() // TODO Remove me together with patched setTimeout function in app.module.js.
            onKey('down', arrowDown)
            tick()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_FOCUS_NEXT'])
        })

        it('should flag next focusable entry as read before it is focused', () => {
            givenState([{uuid: '2', seen: false, tag: 'expected tag'}])
            element.querySelectorAll('button')[1].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['PATCH_ENTRY', 'ENTRY_FOCUS_NEXT'])
            expect(ngReduxMock.getActions()[0]).toContainActionData({body: {seen: true, tag: 'expected tag'}})
            expect(ngReduxMock.getActions()[0].url).toMatch(/subscriptionEntries\/2$/)
        })

        it('should not flag next focusable entry as read when it is already flagged as read', () => {
            givenState([{uuid: '2', seen: true}])
            element.querySelectorAll('button')[1].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_FOCUS_NEXT'])
        })

        it('should flag new entry as read when enter button pressed', () => {
            jest.useFakeTimers() // TODO Remove me together with patched setTimeout function in app.module.js.
            givenState([{uuid: '1', tag: 'expected tag'}])
            onKey('down', enter)
            tick()

            expect(ngReduxMock.getActionTypes()).toEqual(['PATCH_ENTRY'])
            expect(ngReduxMock.getActions()[0]).toContainActionData({body: {seen: true, tag: 'expected tag'}})
            expect(ngReduxMock.getActions()[0].url).toMatch(/subscriptionEntries\/1$/)
        })

        it('should flag old entry as unread when enter button pressed', () => {
            jest.useFakeTimers() // TODO Remove me together with patched setTimeout function in app.module.js.
            givenState([{uuid: '1', seen: true, tag: 'expected tag'}])
            onKey('down', enter)
            tick()

            expect(ngReduxMock.getActionTypes()).toEqual(['PATCH_ENTRY'])
            expect(ngReduxMock.getActions()[0]).toContainActionData({body: {seen: false, tag: 'expected tag'}})
            expect(ngReduxMock.getActions()[0].url).toMatch(/subscriptionEntries\/1$/)
        })
    })

    describe('', () => {

        let listPage

        beforeEach(() => {
            listPage = componentMock('myListPage')
            angular.mock.module('myreader', mockNgRedux(), listPage)
        })

        beforeEach(inject(($rootScope, $compile, $ngRedux) => {
            scope = $rootScope.$new(true)
            ngReduxMock = $ngRedux

            ngReduxMock.setState({router: {query: {param1: 'expected param1', param2: 'expected param2'}}})

            givenState([{uuid: '1'}, {uuid: '2'}])

            element = $compile('<my-feed-stream></my-feed-stream>')(scope)[0]
            scope.$digest()
        }))

        it('should update url when search executed', () => {
            listPage.bindings.myOnSearch({params: {q: 'b'}})
            scope.$digest()

            expect(ngReduxMock.getActions()[0]).toContainActionData({route: ['app', 'entries'], query: {q: 'b'}})
        })

        it('should refresh state', () => {
            listPage.bindings.myOnRefresh()
            scope.$digest()

            expect(ngReduxMock.getActionTypes()).toEqual(['GET_SUBSCRIPTIONS', 'ROUTE_CHANGED'])

            expect(ngReduxMock.getActions()[1])
                .toContainActionData({route: ['app', 'entries'], query: {param1: 'expected param1', param2: 'expected param2'}})
        })

        it('should show action panel when media breakpoint is "desktop"', () => {
            givenState([], null, null, 'desktop')
            scope.$digest()

            expect(element.querySelector('my-action-panel')).not.toBeNull()
        })

        it('should not show action panel when media breakpoint is "tablet"', () => {
            givenState([], null, null, 'tablet')
            scope.$digest()

            expect(element.querySelector('my-action-panel')).toBeNull()
        })

        it('should not show action panel when media breakpoint is "phone"', () => {
            givenState([], null, null, 'phone')
            scope.$digest()

            expect(element.querySelector('my-action-panel')).toBeNull()
        })
    })
})
