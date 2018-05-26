import {mockNgRedux} from '../../shared/test-utils'

describe('src/app/js/entry/entry-content/entry-content.component.spec.js', () => {

    describe('controller', () => {

        let component, ngReduxMock

        beforeEach(angular.mock.module('myreader', mockNgRedux()))

        beforeEach(inject((_$componentController_, $ngRedux) => {
            ngReduxMock = $ngRedux
            ngReduxMock.setState({settings: {showEntryDetails: false}})

            component = _$componentController_('myEntryContent', {$ngRedux: ngReduxMock}, {})
            component.$onInit()
        }))

        it('should set default values on init', inject(_$componentController_ => {
            component = _$componentController_('myEntryContent')
            component.$onInit()

            expect(component.item).toEqual({})
            expect(component.show).toEqual(false)
        }))

        it('should set provided values on init', inject(_$componentController_ => {
            component = _$componentController_('myEntryContent', null, {myItem: 'expected', myShow: true})
            component.$onInit()

            expect(component.item).toEqual('expected')
            expect(component.show).toEqual(true)
        }))

        it('should not update show flag when myShow is undefined on $onChanges', () => {
            component.$onChanges({})

            expect(component.show).toEqual(false)
        })

        it('should update show flag when myShow is defined on $onChanges', () => {
            component.$onChanges({myShow: {currentValue: true}})

            expect(component.show).toEqual(true)
        })

        describe('showEntryContent()', () => {

            describe('with myShow set to false', function () {

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

            describe('with myShow set to true', () => {

                beforeEach(inject(_$componentController_ => {
                    ngReduxMock.setState({settings: {showEntryDetails: true}})

                    component = _$componentController_('myEntryContent', {$ngRedux: ngReduxMock}, {myShow: true})
                    component.$onInit()
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

    describe('with html', () => {

        let compile, scope, element

        beforeEach(angular.mock.module('myreader', mockNgRedux()))

        beforeEach(inject(($rootScope, $compile) => {
            compile = $compile

            scope = $rootScope.$new(true)
            scope.item = {
                content: 'entry content'
            }
            scope.show = true
        }))

        it('should render entry content', () => {
            element = compile('<my-entry-content my-item="item" my-show="show"></my-entry-content>')(scope)[0]
            scope.$digest()

            expect(element.querySelectorAll('div')[0].textContent).toEqual('entry content')
        })

        it('should render html encoded entry content', () => {
            scope.item.content = '&quotentry content&quot'
            element = compile('<my-entry-content my-item="item" my-show="show"></my-entry-content>')(scope)[0]
            scope.$digest()

            expect(element.querySelectorAll('div')[0].textContent).toEqual('"entry content"')
        })

        it('should not render entry content when myShow is set to false', () => {
            scope.show = false
            element = compile('<my-entry-content my-item="item" my-show="show"></my-entry-content>')(scope)
            scope.$digest()

            expect(element[0].querySelectorAll('div')[0]).toBeUndefined()
        })
    })
})
