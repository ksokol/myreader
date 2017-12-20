import {componentMock, multipleComponentMock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/entry/entry-list.component.spec.js', () => {

    const autoScroll = componentMock('myAutoScroll')
    const entry = multipleComponentMock('myEntry')
    const loadMore = componentMock('myLoadMore')

    let rootScope, scope, element, $ngRedux

    beforeEach(angular.mock.module('myreader', autoScroll, entry, loadMore, mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, _$ngRedux_) => {
        rootScope = $rootScope
        $ngRedux = _$ngRedux_
        scope = $rootScope.$new()

        $ngRedux.onConnect = {
            entries: [{uuid: '1'}, {uuid: '2'}, {uuid: '3'}],
            links: {
                next: {
                    path: 'expected-path',
                    query: {}
                }
            },
            entryInFocus: {uuid: '2'}
        }

        element = $compile('<my-entry-list></my-entry-list>')(scope)
        scope.$digest()
    }))

    it('should pass properties to child components', () => {
        expect(autoScroll.bindings.myScrollOn).toEqual({'data-uuid': '2'})
        expect(entry.bindings).toContainObject([{myItem: {uuid: '1'}}, {myItem: {uuid: '2'}}, {myItem: {uuid: '3'}}])
        expect(loadMore.bindings.myNext).toEqual({path: 'expected-path', query: {}})
    })

    it('should highlight entry that corresponds to entryInFocus', () => {
        expect(element.find('my-auto-scroll').children()[0].classList).not.toContain('focus')
        expect(element.find('my-auto-scroll').children()[1].classList).toContain('focus')
        expect(element.find('my-auto-scroll').children()[2].classList).not.toContain('focus')
    })

    it('should dispatch action for next page', () => {
        loadMore.bindings.myOnMore({more: loadMore.bindings.myNext})
        $ngRedux.thunk({settings: {pageSize: 5}})

        expect($ngRedux.lastAction()).toEqualActionType('GET')
        expect($ngRedux.lastAction()).toContainActionData({url: 'expected-path?size=5'})
    })
})
