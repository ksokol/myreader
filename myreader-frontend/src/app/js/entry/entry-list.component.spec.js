import {componentMock, multipleComponentMock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/entry/entry-list.component.spec.js', () => {

    const autoScroll = componentMock('myAutoScroll')
    const entry = multipleComponentMock('myEntry')
    const loadMore = componentMock('myLoadMore')

    let rootScope, scope, element, ngReduxMock

    beforeEach(angular.mock.module('myreader', autoScroll, entry, loadMore, mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        rootScope = $rootScope
        ngReduxMock = $ngRedux
        scope = $rootScope.$new()

        ngReduxMock.setState({
            entry: {
                entries: [{uuid: '1'}, {uuid: '2'}, {uuid: '3'}],
                links: {
                    next: {
                        path: 'expected-path',
                        query: {}
                    }
                },
                entryInFocus: '2'
            }
        })

        element = $compile('<my-entry-list></my-entry-list>')(scope)
        scope.$digest()
    }))

    it('should pass properties to child components', () => {
        expect(autoScroll.bindings.myScrollOn).toEqual({'data-uuid': '2'})
        expect(entry.bindings).toContainObject([{myItem: {uuid: '1'}}, {myItem: {uuid: '2'}}, {myItem: {uuid: '3'}}])
        expect(loadMore.bindings.myNext).toEqual({path: 'expected-path', query: {}})
    })

    it('should highlight entry that corresponds to entryInFocus', () => {
        const entries = element.find('ng-transclude').children()

        expect(entries[0].classList).not.toContain('focus')
        expect(entries[1].classList).toContain('focus')
        expect(entries[2].classList).not.toContain('focus')
    })

    it('should dispatch action for next page', () => {
        loadMore.bindings.myOnMore({more: loadMore.bindings.myNext})

        expect(ngReduxMock.getActionTypes()).toEqual(['GET_ENTRIES'])
        expect(ngReduxMock.getActions()[0].url).toContain('expected-path')
    })

    it('should purge entries from store when component is about to be destroyed', () => {
        scope.$destroy()
        expect(ngReduxMock.getActionTypes()).toEqual(['ENTRY_CLEAR'])
    })
})
