import {componentMock, mockNgRedux} from '../shared/test-utils'

describe('src/app/js/entry/entry.component.spec.js', () => {

    const entryTitle = componentMock('myEntryTitle')
    const entryActions = componentMock('myEntryActions')
    const entryTags = componentMock('myEntryTags')
    const entryContent = componentMock('myEntryContent')

    let rootScope, scope, element, item, $ngRedux

    beforeEach(angular.mock.module('myreader', entryTitle, entryActions, entryTags, entryContent, mockNgRedux()))

    beforeEach(inject(($rootScope, $compile, _$ngRedux_) => {
        rootScope = $rootScope
        $ngRedux = _$ngRedux_
        scope = $rootScope.$new()

        scope.item = item = {
            uuid: 'uuid',
            seen: false,
            tag: 'tag'
        }

        element = $compile('<my-entry my-item="item"></my-entry>')(scope)
        scope.$digest()
    }))

    it('should propagate item to child components', () => {
        expect(entryTitle.bindings.myItem).toEqual(item)
        expect(entryActions.bindings.myItem).toEqual(item)
        expect(entryTags.bindings.myItem).toEqual(item)
        expect(entryContent.bindings.myItem).toEqual(item)
    })

    it('should show or hide entryTags and entryContent components based on showMore flag', () => {
        entryActions.bindings.myOnMore({showMore: true})
        rootScope.$digest()

        expect(entryTags.bindings.myShow).toEqual(true)
        expect(entryContent.bindings.myShow).toEqual(true)

        entryActions.bindings.myOnMore({showMore: false})
        rootScope.$digest()

        expect(entryTags.bindings.myShow).toEqual(false)
        expect(entryContent.bindings.myShow).toEqual(false)
    })

    it('should update seen flag when entryActions component fired myOnCheck event', () => {
        entryActions.bindings.myOnCheck({item: {seen: true}})

        $ngRedux.thunk()
        expect($ngRedux.lastAction()).toContainActionData({
                type: 'PATCH',
                url: '/myreader/api/2/subscriptionEntries/uuid',
                body: {seen: true, tag: 'tag'}
        })
    })

    it('should update tag when entryTags component fired onSelect event', () => {
        entryTags.bindings.myOnChange({tag: 'tag1'})

        $ngRedux.thunk()
        expect($ngRedux.lastAction()).toContainActionData({
                    type: 'PATCH',
                    url: '/myreader/api/2/subscriptionEntries/uuid',
                    body: {seen: false, tag: 'tag1'}
        })
    })
})
