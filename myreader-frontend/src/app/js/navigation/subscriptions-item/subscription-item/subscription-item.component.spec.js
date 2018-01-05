import {mock} from '../../../shared/test-utils'

describe('src/app/js/navigation/subscriptions-item/subscription-item/subscription-item.component.spec.js', () => {

    beforeEach(angular.mock.module('myreader', mock('$state'), mock('$stateParams')))

    describe('$onInit', () => {

        let component

        it('should set default values', inject(_$componentController_ => {
            component = _$componentController_('myNavigationSubscriptionItem')
            component.$onInit()

            expect(component.item).toEqual({})
        }))

        it('should use bindings', inject(_$componentController_ => {
            const bindings = {myItem: 'expected myItem'}
            component = _$componentController_('myNavigationSubscriptionItem', null, bindings)
            component.$onInit()

            expect(component.item).toEqual('expected myItem')
        }))
    })

    describe('controller', () => {

        let component, bindings, myOnSelect, state, stateParams

        beforeEach(inject(_$componentController_ => {
            state = jasmine.createSpyObj('state', ['go'])
            myOnSelect = jasmine.createSpy('myOnSelect')

            bindings = {
                myOnSelect: myOnSelect
            }

            stateParams = {
                feedTagEqual: 'tag',
                feedUuidEqual: 'uuid'
            }

            component = _$componentController_('myNavigationSubscriptionItem', {$state: state, $stateParams: stateParams}, bindings)
            component.$onInit()
        }))

        it('should not mark item as selected when uuid does not match', () => {
            const item = {
                tag: stateParams.feedTagEqual,
                uuid: 'other uuid'
            }

            expect(component.isSelected(item)).toEqual(false)
        })

        it('should not mark item as selected when tag does not match', () => {
            const item = {
                tag: 'other tag',
                uuid: stateParams.feedUuidEqual
            }

            expect(component.isSelected(item)).toEqual(false)
        })

        it('should mark item as selected when tag and uuid match', () => {
            const item = {
                tag: stateParams.feedTagEqual,
                uuid: stateParams.feedUuidEqual
            }

            expect(component.isSelected(item)).toEqual(true)
        })

        it('should mark submenu as open when tag matches', inject(_$componentController_ => {
            bindings.myItem = {
                tag: stateParams.feedTagEqual
            }

            component = _$componentController_('myNavigationSubscriptionItem', {$stateParams: stateParams}, bindings)
            component.$onInit()

            expect(component.isOpen()).toEqual(true)
        }))

        it('should not mark submenu as open when tag does not match', inject(_$componentController_ => {
            bindings.myItem = {
                tag: 'other tag'
            }

            component = _$componentController_('myNavigationSubscriptionItem', {$stateParams: stateParams}, bindings)
            component.$onInit()

            expect(component.isOpen()).toEqual(false)
        }))

        it('should navigate to route with feedTagEqual and feedUuidEqual set', () => {
            component.onSelect('selected tag', 'selected uuid')
            expect(state.go)
                .toHaveBeenCalledWith('app.entries', {feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid'}, {inherit: false})
        })

        it('should navigate to route with feedTagEqual to null when value is null', () => {
            component.onSelect(null, 'selected uuid')
            expect(state.go)
                .toHaveBeenCalledWith('app.entries', {feedTagEqual: null, feedUuidEqual: 'selected uuid'}, {inherit: false})
        })

        it('should navigate to route with feedTagEqual given value and feedUuidEqual set to null when value is null', () => {
            component.onSelect('selected tag', null)
            expect(state.go)
                .toHaveBeenCalledWith('app.entries', {feedTagEqual: 'selected tag', feedUuidEqual: null}, {inherit: false})
        })

        it('should construct comparison value for ng-repeat track by', () =>
            expect(component.trackBy({uuid: '1', unseen: 2})).toEqual('{"uuid":"1","unseen":2}'))
    })

    describe('with html', () => {

        let scope, element, myOnSelect, state, stateParams

        const item = {
            title: 'item title',
            unseen: 2,
            tag: 'tag',
            uuid: 'uuid',
            subscriptions: [
                { title: 'subscription 1', tag: 'tag', uuid: 'uuid1', unseen: 1 },
                { title: 'subscription 2', tag: 'tag', uuid: 'uuid2', unseen: 0 }
            ]
        }

        beforeEach(inject(($rootScope, $compile, $state, $stateParams) => {
            myOnSelect = jasmine.createSpy('myOnSelect')
            state = $state
            stateParams = $stateParams

            scope = $rootScope.$new()
            scope.item = item
            scope.onSelect = myOnSelect

            state.go = jasmine.createSpy('$state.go()')
            stateParams['feedTagEqual'] = scope.item.tag
            stateParams['feedUuidEqual'] = scope.item.uuid

            element = $compile(`<my-navigation-subscription-item my-item="item"
                                                                 my-on-select="onSelect()">
                                </my-navigation-subscription-item>`)(scope)
            scope.$digest()
        }))

        describe('parent item', () => {

            it('should not mark as selected', inject($compile => {
                stateParams['feedTagEqual'] = null
                stateParams['feedUuidEqual'] = null

                element = $compile(`<my-navigation-subscription-item my-item="item" 
                                                                     my-on-select="onSelect()">
                                    </my-navigation-subscription-item>`)(scope)
                scope.$digest()

                expect(element.find('li')[0].classList).not.toContain('my-subscription-item--selected')
            }))

            it('should mark as selected', () => {
                expect(element.find('li')[0].classList).toContain('my-subscription-item--selected')
            })

            it('should emit myOnSelect event when a selection occurred', () => {
                element.find('button')[0].click()
                scope.$digest()

                expect(myOnSelect).toHaveBeenCalledWith()
            })

            it('should render title and unseen count', () => {
                const div = angular.element(element.find('li')[0]).find('div')

                expect(div.find('div')[0].innerText).toEqual('item title')
                expect(angular.element(div.find('div')[1]).find('span').text()).toEqual('2')
            })
        })

        describe('sub items', () => {

            it('should not render items when not selected', inject($compile => {
                stateParams['feedTagEqual'] = null
                stateParams['feedUuidEqual'] = null

                element = $compile(`<my-navigation-subscription-item my-item="item">
                                    </my-navigation-subscription-item>`)(scope)
                scope.$digest()

                expect(element.find('ul')[0]).toBeUndefined()
            }))

            it('should not render items when no subscriptions available', inject($compile => {
                scope.item = {...scope.item, subscriptions: []}

                element = $compile(`<my-navigation-subscription-item my-item="item">
                                    </my-navigation-subscription-item>`)(scope)
                scope.$digest()

                expect(element.find('ul')[0]).toBeUndefined()
            }))

            it('should render every item', () => {
                expect(element.find('ul').find('li').length).toEqual(2)
            })

            it('should not mark as selected', () => {
                const items = element.find('ul').find('li')

                expect(items[0].classList).not.toContain('my-subscription-item--selected')
                expect(items[1].classList).not.toContain('my-subscription-item--selected')
            })

            it('should not render items when item is selected but subscriptions property is undefined', inject($compile => {
                scope.item = {...scope.item}
                delete scope.item.subscriptions
                element = $compile(`<my-navigation-subscription-item my-item="item">
                                    </my-navigation-subscription-item>`)(scope)
                scope.$digest()

                expect(element.find('ul')[0]).toBeUndefined()
            }))

            it('should mark as selected', () => {
                stateParams['feedTagEqual'] = scope.item.tag
                stateParams['feedUuidEqual'] = 'uuid1'
                scope.$digest()

                const items = element.find('ul').find('li')

                expect(items[0].classList).toContain('my-subscription-item--selected')
                expect(items[1].classList).not.toContain('my-subscription-item--selected')
            })

            it('should emit myOnSelect event when a selection occurred', () => {
                element.find('ul').find('li').find('button')[1].click()
                scope.$digest()

                expect(myOnSelect).toHaveBeenCalledWith()
            })

            it('should render item title with unseen count', () => {
                const div1 = angular.element(angular.element(element.find('ul').find('button')[0]).find('div')).find('div')

                expect(div1[0].innerText).toEqual('subscription 1')
                expect(angular.element(div1[1]).find('span').text()).toEqual('1')
            })
        })
    })
})
