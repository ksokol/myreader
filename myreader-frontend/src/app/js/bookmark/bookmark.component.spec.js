import {componentMock, mockNgRedux} from '../shared/test-utils'

class Bookmark {

    constructor(el) {
        this.el = el
    }

    chips() {
        return Object.values(this.el.find('my-chip')).filter(it => angular.element(it).children().length > 0).map(it => {
            return {
                selected: angular.element(it).children()[0].classList.contains('my-chip--selected'),
                click: () => angular.element(it).children()[0].click()
            }
        })
    }

    entryList() {
        return this.el.find('my-entry-list')[0]
    }
}

describe('src/app/js/bookmark/bookmark.component.spec.js', () => {

    const entryList = componentMock('myEntryList')
    let rootScope, scope, compile, ngReduxMock, bookmark, element

    describe('', () => {

        beforeEach(angular.mock.module('myreader', entryList, mockNgRedux()))

        beforeEach(inject(($rootScope, $compile, $ngRedux) => {
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
            bookmark = new Bookmark(element)
        }))

        it('should pass properties to Chip components', () => {
            expect(bookmark.chips()[1].selected).toEqual(true)
        })

        it('should update url with selected entry tag', () => {
            bookmark.chips()[0].click()

            expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
            expect(ngReduxMock.getActions()[0]).toContainActionData({route: ['app', 'bookmarks'], query: {entryTagEqual: 'tag1'}})
        })

        it('should contain EntryListComponent', () => expect(bookmark.entryList()).toBeDefined())
    })

    describe('', () => {

        const listPage = componentMock('myListPage')

        beforeEach(angular.mock.module('myreader', entryList, listPage, mockNgRedux()))

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
