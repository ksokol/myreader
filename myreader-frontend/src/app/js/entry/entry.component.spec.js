import {componentMock, mockNgRedux, reactComponent} from '../shared/test-utils'

describe('src/app/js/entry/entry.component.spec.js', () => {

    let rootScope, scope, element, item, ngReduxMock, entryTitle, entryActions, entryTags, entryContent

    beforeEach(() => {
        entryTitle = reactComponent('EntryTitle')
        entryActions = reactComponent('EntryActions')
        entryTags = componentMock('myEntryTags')
        entryContent = reactComponent('EntryContent')
        angular.mock.module('myreader', entryTitle, entryActions, entryTags, entryContent, mockNgRedux())
    })

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
        rootScope = $rootScope
        ngReduxMock = $ngRedux

        ngReduxMock.setState({common: {mediaBreakpoint: 'desktop'}, settings: {showEntryDetails: true}})
        scope = $rootScope.$new(true)

        scope.item = item = {
            uuid: 'uuid',
            seen: false,
            tag: 'tag'
        }

        element = $compile('<my-entry my-item="item"></my-entry>')(scope)[0]
        scope.$digest()
    }))

    it('should propagate item to child components', () => {
        expect(entryTitle.bindings).toEqual({...item})
        expect(entryActions.bindings).toEqual(expect.objectContaining({seen: item.seen}))
        expect(entryTags.bindings.myItem).toEqual(item)
        expect(entryContent.bindings).toEqual({...item})
    })

    it('should show or hide entryTags component based on showMore flag', () => {
        entryActions.bindings.onToggleShowMore()
        rootScope.$digest()

        expect(entryTags.bindings.myShow).toEqual(true)

        entryActions.bindings.onToggleShowMore()
        rootScope.$digest()

        expect(entryTags.bindings.myShow).toEqual(false)
    })

    it('should show or hide entryContent component based on showMore flag', () => {
        ngReduxMock.setState({common: {mediaBreakpoint: 'phone'}})
        entryActions.bindings.onToggleShowMore()
        rootScope.$digest()

        expect(element.querySelector('react-component[name="EntryContent"]')).not.toBeNull()

        entryActions.bindings.onToggleShowMore()
        rootScope.$digest()

        expect(element.querySelector('react-component[name="EntryContent"]')).toBeNull()
    })

    it('should update seen flag when entryActions component fired myOnCheck event', () => {
        entryActions.bindings.onToggleSeen()

        expect(ngReduxMock.getActions()[0]).toContainObject({type: 'PATCH_ENTRY', body: {seen: true, tag: 'tag'}})
    })

    it('should update tag when entryTags component fired onSelect event', () => {
        entryTags.bindings.myOnChange({tag: 'tag1'})

        expect(ngReduxMock.getActions()[0]).toContainObject({type: 'PATCH_ENTRY', body: {seen: false, tag: 'tag1'}})
    })

    describe('controller', () => {

        let component, ngReduxMock

        beforeEach(inject((_$componentController_, $ngRedux) => {
            ngReduxMock = $ngRedux
            ngReduxMock.setState({settings: {showEntryDetails: false}})

            component = _$componentController_('myEntry', {$ngRedux: ngReduxMock}, {})
            component.$onInit()
            component.toggleMore(false)
        }))

        describe('showEntryContent()', () => {

            describe('with showMore set to false', function () {

                beforeEach(inject(() => component.toggleMore()))

                it('should return false when showEntryDetails is false and media breakpoint is not of type desktop', () => {
                    ngReduxMock.setState({common: {mediaBreakpoint: 'phone'}, settings: {showEntryDetails: false}})
                    expect(component.showEntryContent()).toEqual(false)
                })

                it('should return false when showEntryDetails is true and media breakpoint is not of type desktop', () => {
                    ngReduxMock.setState({common: {mediaBreakpoint: 'phone'}, settings: {showEntryDetails: true}})
                    expect(component.showEntryContent()).toEqual(false)
                })

                it('should return false when showEntryDetails is false and media breakpoint is of type desktop', () => {
                    ngReduxMock.setState({common: {mediaBreakpoint: 'desktop'}, settings: {showEntryDetails: false}})
                    expect(component.showEntryContent()).toEqual(false)
                })

                it('should return true when showEntryDetails is true and media breakpoint is of type desktop', () => {
                    ngReduxMock.setState({common: {mediaBreakpoint: 'desktop'}, settings: {showEntryDetails: true}})
                    expect(component.showEntryContent()).toEqual(true)
                })
            })

            describe('with showMore set to true', () => {

                beforeEach(inject(_$componentController_ => {
                    ngReduxMock.setState({settings: {showEntryDetails: true}})

                    component = _$componentController_('myEntry', {$ngRedux: ngReduxMock}, {myShow: true})
                    component.$onInit()
                    component.toggleMore(true)
                }))

                it('should return true when showEntryDetails and media breakpoint is not of type desktop', () => {
                    ngReduxMock.setState({common: {mediaBreakpoint: 'phone'}, settings: {showEntryDetails: false}})
                    expect(component.showEntryContent()).toEqual(true)
                })

                it('should return true when showEntryDetails is true and media breakpoint is not of type desktop', () => {
                    ngReduxMock.setState({common: {mediaBreakpoint: 'phone'}, settings: {showEntryDetails: true}})
                    expect(component.showEntryContent()).toEqual(true)
                })

                it('should return true when showEntryDetails is false and media breakpoint is of type desktop', () => {
                    ngReduxMock.setState({common: {mediaBreakpoint: 'desktop'}, settings: {showEntryDetails: false}})
                    expect(component.showEntryContent()).toEqual(true)
                })

                it('should return true when showEntryDetails is true and media breakpoint is of type desktop', () => {
                    ngReduxMock.setState({common: {mediaBreakpoint: 'desktop'}, settings: {showEntryDetails: true}})
                    expect(component.showEntryContent()).toEqual(true)
                })
            })
        })
    })
})
