import {componentMock, mock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/bookmark/bookmark.component.spec.js', () => {

    const bookmarkTags = componentMock('myBookmarkTags')
    const entryList = componentMock('myEntryList')
    let rootScope, scope, compile, state, stateParams, ngReduxMock, element

    describe('', () => {

        beforeEach(() => angular.mock.module('myreader', bookmarkTags, entryList, mock('$state'), mock('$stateParams'), mockNgRedux()))

        beforeEach(inject(($rootScope, $compile, $state, $stateParams, $ngRedux) => {
            rootScope = $rootScope
            state = $state
            compile = $compile
            stateParams = $stateParams
            ngReduxMock = $ngRedux
            scope = $rootScope.$new()

            state.go = jasmine.createSpy('$state.go')
            state.go.and.returnValue({then: () => {}})
            stateParams.entryTagEqual = 'tag2'
            stateParams.other = 'expected other'

            ngReduxMock.setState({entry: {tags: ['tag1', 'tag2']}})

            element = $compile('<my-bookmark></my-bookmark>')(scope)
            scope.$digest()
        }))

        it('should dispatch expected action on component initialization', () => {
            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_CLEAR', 'GET_ENTRY_TAGS'])
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
                        ngReduxMock.clearActions()
                        cb()

                        expect(ngReduxMock.getActionTypes()).toEqual(['GET_ENTRIES'])
                        expect(ngReduxMock.getActions()[0].url).toContain('other=expected other&entryTagEqual=tag2')
                        done()
                    }
                }
            })

            element = compile('<my-bookmark></my-bookmark>')(scope)
            scope.$digest()
        })

        it('should clear entries in store on component destroy', () => {
            ngReduxMock.clearActions()
            scope.$destroy()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_CLEAR'])
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
            ngReduxMock = $ngRedux
            scope = $rootScope.$new()

            state.go = jasmine.createSpy('$state.go')
            state.go.and.returnValue({then: () => {}})

            ngReduxMock.setState({entry: {tags: []}})

            element = $compile('<my-bookmark></my-bookmark>')(scope)
            scope.$digest()
        }))

        it('should update url when search executed', () => {
            listPage.bindings.myOnSearch({params: {q: 'b'}})
            scope.$digest()

            expect(state.go).toHaveBeenCalledWith('app.bookmarks', {q: 'b', seenEqual: '*'}, {notify: false})
        })

        it('should refresh state', () => {
            ngReduxMock.clearActions()

            listPage.bindings.myOnRefresh()
            scope.$digest()

            expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_CLEAR', 'GET_ENTRY_TAGS'])
            expect(state.go).toHaveBeenCalledWith('app.bookmarks', {seenEqual: '*'}, {notify: false})
        })
    })
})
