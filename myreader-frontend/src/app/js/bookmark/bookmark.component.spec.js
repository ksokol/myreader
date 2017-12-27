import {componentMock, mock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/bookmark/bookmark.component.spec.js', () => {

    const bookmarkTags = componentMock('myBookmarkTags')
    const entryList = componentMock('myEntryList')
    let rootScope, scope, compile, state, stateParams, ngRedux, element

    describe('', () => {

        beforeEach(() => angular.mock.module('myreader', bookmarkTags, entryList, mock('$state'), mock('$stateParams'), mockNgRedux()))

        beforeEach(inject(($rootScope, $compile, $state, $stateParams, $ngRedux) => {
            rootScope = $rootScope
            state = $state
            compile = $compile
            stateParams = $stateParams
            ngRedux = $ngRedux
            scope = $rootScope.$new()

            state.go = jasmine.createSpy('$state.go')
            state.go.and.returnValue({then: () => {}})
            stateParams.entryTagEqual = 'tag2'
            stateParams.other = 'expected other'

            ngRedux.state = {entry: {tags: ['tag1', 'tag2']}}

            element = $compile('<my-bookmark></my-bookmark>')(scope)
            scope.$digest()
        }))

        it('should dispatch expected action on component initialization', () => {
            expect(ngRedux.dispatch.calls.first().args[0]).toEqualActionType('ENTRY_CLEAR')
            expect(ngRedux.dispatch.calls.mostRecent().args[0]).toEqualActionType('GET')
            expect(ngRedux.dispatch.calls.mostRecent().args[0]).toContainActionData({url: '/myreader/api/2/subscriptionEntries/availableTags'})
            expect(state.go).toHaveBeenCalledWith('app.bookmarks', {entryTagEqual: 'tag2', other: 'expected other', seenEqual: '*'}, {notify: false})
        })

        it('should pass properties to BookmarkTagsComponent', () => {
            expect(bookmarkTags.bindings.mySelected).toEqual('tag2')
            expect(bookmarkTags.bindings.myTags).toEqual(['tag1', 'tag2'])
        })

        it('should update url with selected entry tag', () => {
            bookmarkTags.bindings.myOnSelect({tag: 'tag1'})
            scope.$digest()

            expect(state.go).toHaveBeenCalledWith('app.bookmarks', {entryTagEqual: 'tag1', other: 'expected other', seenEqual: '*'}, {notify: false})
        })

        it('should retrieve entries for selected tag when url changed', done => {
            state.go.and.callFake(() => {
                return {
                    then: cb => {
                        ngRedux.dispatch.calls.reset()
                        cb()

                        ngRedux.thunk({settings: {pageSize: 10}})
                        expect(ngRedux.dispatch.calls.mostRecent().args[0]).toEqualActionType('GET')
                        expect(ngRedux.dispatch.calls.mostRecent().args[0]).toContainActionData({
                            url: '/myreader/api/2/subscriptionEntries?size=10&seenEqual=*&other=expected other&entryTagEqual=tag2'
                        })
                        done()
                    }
                }
            })

            element = compile('<my-bookmark></my-bookmark>')(scope)
            scope.$digest()
        })

        it('should clear entries in store on component destroy', () => {
            ngRedux.dispatch.calls.reset()
            scope.$destroy()

            expect(ngRedux.dispatch).toHaveBeenCalledWith({type: 'ENTRY_CLEAR'})
        })

        it('should contain EntryListComponent', () => {
            expect(element.find('my-entry-list').length).toEqual(1)
        })
    })

    describe('', () => {

        const listPage = componentMock('myListPage')

        beforeEach(() => angular.mock.module('myreader', bookmarkTags, entryList, listPage, mock('$state'), mock('$stateParams'), mockNgRedux()))

        beforeEach(inject(($rootScope, $compile, $state, $stateParams, $ngRedux) => {
            rootScope = $rootScope
            state = $state
            compile = $compile
            ngRedux = $ngRedux
            scope = $rootScope.$new()

            state.go = jasmine.createSpy('$state.go')
            state.go.and.returnValue({then: () => {}})

            ngRedux.state = {entry: {tags: []}}

            element = $compile('<my-bookmark></my-bookmark>')(scope)
            scope.$digest()
        }))

        it('should update url when search executed', () => {
            listPage.bindings.myOnSearch({params: {q: 'b'}})
            scope.$digest()

            expect(state.go).toHaveBeenCalledWith('app.bookmarks', {q: 'b', seenEqual: '*'}, {notify: false})
        })

        it('should refresh state', () => {
            ngRedux.dispatch.calls.reset()
            listPage.bindings.myOnRefresh()
            scope.$digest()

            expect(ngRedux.dispatch.calls.first().args[0]).toEqualActionType('ENTRY_CLEAR')
            expect(ngRedux.dispatch.calls.mostRecent().args[0]).toEqualActionType('GET')
            expect(ngRedux.dispatch.calls.mostRecent().args[0]).toContainActionData({url: '/myreader/api/2/subscriptionEntries/availableTags'})
            expect(state.go).toHaveBeenCalledWith('app.bookmarks', {seenEqual: '*'}, {notify: false})
        })
    })
})
