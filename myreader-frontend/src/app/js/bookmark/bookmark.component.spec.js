import {componentMock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/bookmark/bookmark.component.spec.js', () => {

    const bookmarkTags = componentMock('myBookmarkTags')
    const entryList = componentMock('myEntryList')
    let rootScope, scope, compile, ngReduxMock, element

    describe('', () => {

        beforeEach(() => angular.mock.module('myreader', bookmarkTags, entryList, mockNgRedux()))

        beforeEach(inject(($rootScope, $compile, $state, $stateParams, $ngRedux) => {
            rootScope = $rootScope
            compile = $compile
            ngReduxMock = $ngRedux
            scope = $rootScope.$new(true)

            ngReduxMock.setState({
                router: {query: {entryTagEqual: 'tag2'}},
                entry: {tags: ['tag1', 'tag2']}
            })

            element = $compile('<my-bookmark></my-bookmark>')(scope)
            scope.$digest()
        }))

        it('should pass properties to BookmarkTagsComponent', () => {
            expect(bookmarkTags.bindings.mySelected).toEqual('tag2')
            expect(bookmarkTags.bindings.myTags).toEqual(['tag1', 'tag2'])
        })

        it('should update url with selected entry tag', () => {
            bookmarkTags.bindings.myOnSelect({tag: 'tag1'})
            scope.$digest()

            expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
            expect(ngReduxMock.getActions()[0]).toContainActionData({route: ['app', 'bookmarks'], query: {entryTagEqual: 'tag1'}})
        })

        it('should contain EntryListComponent', () => {
            expect(element.find('my-entry-list').length).toEqual(1)
        })
    })

    describe('', () => {

        const listPage = componentMock('myListPage')

        beforeEach(() => angular.mock.module('myreader', bookmarkTags, entryList, listPage, mockNgRedux()))

        beforeEach(inject(($rootScope, $compile, $ngRedux) => {
            rootScope = $rootScope
            compile = $compile
            ngReduxMock = $ngRedux
            scope = $rootScope.$new(true)

            ngReduxMock.setState({entry: {tags: []}})

            element = $compile('<my-bookmark></my-bookmark>')(scope)
            scope.$digest()
        }))

        it('should update url when search executed', () => {
            listPage.bindings.myOnSearch({params: {q: 'b'}})
            scope.$digest()

            expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
            expect(ngReduxMock.getActions()[0]).toContainActionData({route: ['app', 'bookmarks'], query: {q: 'b'}})
        })

        it('should refresh state', () => {
            ngReduxMock.clearActions()
            ngReduxMock.setState({router: {query: {a: 'b'}}})

            listPage.bindings.myOnRefresh()
            scope.$digest()

            expect(ngReduxMock.getActionTypes()).toEqual(['GET_ENTRIES'])
            expect(ngReduxMock.getActions()[0].url).toContain('a=b')
        })
    })
})
