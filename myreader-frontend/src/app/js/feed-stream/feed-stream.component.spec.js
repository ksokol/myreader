import {mockNgRedux, mock, componentMock, onKey, tick} from 'shared/test-utils'

const enter = {key: 'Enter', keyCode: 13}
const arrowDown = {key: 'ArrowDown', keyCode: 40}
const arrowUp = {key: 'ArrowUp', keyCode: 38}

describe('src/app/js/feed-stream/feed-stream.component.spec.js', () => {

    let scope, compile, element, ngReduxMock, state, stateParams

    const givenState = (entries = [], entryInFocus = '1', nextFocusableEntry = '2') =>
        ngReduxMock.setState({entry: {entries, entryInFocus, nextFocusableEntry}})

    describe('', () => {

        beforeEach(() => angular.mock.module('myreader', mockNgRedux(), mock('$state'), mock('$stateParams'), componentMock('myEntryList')))

        beforeEach(inject(($rootScope, $compile, $ngRedux, $state, $stateParams) => {
            scope = $rootScope.$new(true)

            compile = $compile
            ngReduxMock = $ngRedux
            state = $state
            stateParams = $stateParams

            stateParams['param1'] = 'expected param1'
            stateParams['param2'] = 'expected param2'

            state.go = jasmine.createSpy('$state.go()')
            state.go.and.returnValue(new Promise(() => {}))

            givenState([{uuid: '1'}, {uuid: '2'}], '1', '2')

            element = $compile('<my-feed-stream></my-feed-stream>')(scope)
            scope.$digest()
        }))

        describe('', () => {

            // TODO remove clock uninstall after $state service has been removed from component
            beforeEach(jasmine.clock().uninstall)

            it('should fetch entries for given route when route resolved', done => {
                state.go.and.returnValue(Promise.resolve({}))
                element = compile('<my-feed-stream></my-feed-stream>')(scope)
                scope.$digest()

                setTimeout(() => {
                    expect(ngReduxMock.getActionTypes()).toEqual(['GET_ENTRIES'])
                    expect(ngReduxMock.getActions()[0].url).toContain('&param2=expected param2&param1=expected param1')
                    done()
                })
            })
        })

        it('should navigate to route with parameters on initialization', () => {
            expect(state.go).toHaveBeenCalledWith('app.entries', {param1: 'expected param1', param2: 'expected param2'}, {notify: false})
        })

        it('should focus previous entry when previous button clicked', () => {
            element.find('button')[0].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_FOCUS_PREVIOUS'])
        })

        it('should focus previous entry when arrow up key pressed', () => {
            onKey('down', arrowUp)
            tick()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_FOCUS_PREVIOUS'])
        })

        it('should focus next entry when next button clicked', () => {
            element.find('button')[1].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_FOCUS_NEXT'])
        })

        it('should focus next entry when arrow down key pressed', () => {
            onKey('down', arrowDown)
            tick()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_FOCUS_NEXT'])
        })

        it('should flag next focusable entry as read before it is focused', () => {
            givenState([{uuid: '2', seen: false, tag: 'expected tag'}])
            element.find('button')[1].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['PATCH_ENTRY', 'ENTRY_FOCUS_NEXT'])
            expect(ngReduxMock.getActions()[0]).toContainActionData({body: {seen: true, tag: 'expected tag'}})
            expect(ngReduxMock.getActions()[0].url).toMatch(/subscriptionEntries\/2$/)
        })

        it('should not flag next focusable entry as read when it is already flagged as read', () => {
            givenState([{uuid: '2', seen: true}])
            element.find('button')[1].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_FOCUS_NEXT'])
        })

        it('should flag new entry as read when enter button pressed', () => {
            givenState([{uuid: '1', tag: 'expected tag'}])
            onKey('down', enter)
            tick()

            expect(ngReduxMock.getActionTypes()).toEqual(['PATCH_ENTRY'])
            expect(ngReduxMock.getActions()[0]).toContainActionData({body: {seen: true, tag: 'expected tag'}})
            expect(ngReduxMock.getActions()[0].url).toMatch(/subscriptionEntries\/1$/)
        })

        it('should flag old entry as unread when enter button pressed', () => {
            givenState([{uuid: '1', seen: true, tag: 'expected tag'}])
            onKey('down', enter)
            tick()

            expect(ngReduxMock.getActionTypes()).toEqual(['PATCH_ENTRY'])
            expect(ngReduxMock.getActions()[0]).toContainActionData({body: {seen: false, tag: 'expected tag'}})
            expect(ngReduxMock.getActions()[0].url).toMatch(/subscriptionEntries\/1$/)
        })
    })

    describe('', () => {

        const listPage = componentMock('myListPage')

        beforeEach(() => angular.mock.module('myreader', mockNgRedux(), mock('$state'), mock('$stateParams'), listPage))

        beforeEach(inject(($rootScope, $compile, $ngRedux, $state, $stateParams) => {
            jasmine.clock().uninstall()
            scope = $rootScope.$new(true)

            compile = $compile
            ngReduxMock = $ngRedux
            state = $state
            stateParams = $stateParams

            stateParams['param1'] = 'expected param1'
            stateParams['param2'] = 'expected param2'

            state.go = jasmine.createSpy('$state.go()')
            state.go.and.returnValue(new Promise(() => {}))

            givenState([{uuid: '1'}, {uuid: '2'}])

            element = $compile('<my-feed-stream></my-feed-stream>')(scope)
            scope.$digest()
        }))

        it('should update url when search executed', () => {
            state.go.calls.reset()
            listPage.bindings.myOnSearch({params: {q: 'b'}})
            scope.$digest()

            expect(state.go).toHaveBeenCalledWith('app.entries', {q: 'b'}, {notify: false})
        })

        it('should refresh state', () => {
            ngReduxMock.clearActions()

            listPage.bindings.myOnRefresh()
            scope.$digest()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_CLEAR', 'GET_SUBSCRIPTIONS'])
            expect(state.go).toHaveBeenCalledWith('app.entries', {param1: 'expected param1', param2: 'expected param2'}, {notify: false})
        })
    })
})
