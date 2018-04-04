import {mock} from 'shared/test-utils'

class SubscriptionItem {

    constructor(el) {
        this.el = el
    }

    get text() {
        return this.el.querySelector('span:first-of-type').innerText
    }

    get badge() {
        return this.el.querySelector('.my-subscription-item__badge').innerText
    }

    get selected() {
        return this.el.classList.contains('my-navigation__item--selected')
    }
}

class SubscriptionItemPage {

    constructor(el) {
        this.el = el[0]
    }

    get parent() {
        return new SubscriptionItem(this.el.querySelector('li:first-of-type'))
    }

    get subList() {
        return this.el.querySelector('ul')
    }

    get subItems() {
        const items = []
        this.subList.querySelectorAll('li').forEach(it => items.push(new SubscriptionItem(it)))
        return items
    }

}

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

        let component, state, stateParams

        beforeEach(inject(_$componentController_ => {
            state = jasmine.createSpyObj('state', ['go'])

            stateParams = {
                feedTagEqual: 'tag',
                feedUuidEqual: 'uuid'
            }

            component = _$componentController_('myNavigationSubscriptionItem', {$state: state, $stateParams: stateParams})
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
            component = _$componentController_('myNavigationSubscriptionItem', {$stateParams: stateParams}, {myItem: {tag: stateParams.feedTagEqual}})
            component.$onInit()

            expect(component.isOpen()).toEqual(true)
        }))

        it('should not mark submenu as open when tag does not match', inject(_$componentController_ => {
            component = _$componentController_('myNavigationSubscriptionItem', {$stateParams: stateParams}, {myItem: {tag: 'other tag'}})
            component.$onInit()

            expect(component.isOpen()).toEqual(false)
        }))

        it('should navigate to route with feedTagEqual and feedUuidEqual set', () => {
            component.onSelect('selected tag', 'selected uuid')
            expect(state.go).toHaveBeenCalledWith('app.entries', {feedTagEqual: 'selected tag', feedUuidEqual: 'selected uuid'}, {inherit: false})
        })

        it('should navigate to route with feedTagEqual to null when value is null', () => {
            component.onSelect(null, 'selected uuid')
            expect(state.go).toHaveBeenCalledWith('app.entries', {feedTagEqual: null, feedUuidEqual: 'selected uuid'}, {inherit: false})
        })

        it('should navigate to route with feedTagEqual given value and feedUuidEqual set to null when value is null', () => {
            component.onSelect('selected tag', null)
            expect(state.go).toHaveBeenCalledWith('app.entries', {feedTagEqual: 'selected tag', feedUuidEqual: null}, {inherit: false})
        })

        it('should construct comparison value for ng-repeat track by', () =>
            expect(component.trackBy({uuid: '1', unseen: 2})).toEqual('{"uuid":"1","unseen":2}'))
    })

    describe('with html', () => {

        let page, scope, element, state, stateParams

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
            state = $state
            stateParams = $stateParams

            scope = $rootScope.$new(true)
            scope.item = item

            state.go = jasmine.createSpy('$state.go()')
            stateParams['feedTagEqual'] = scope.item.tag
            stateParams['feedUuidEqual'] = scope.item.uuid

            element = $compile('<my-navigation-subscription-item my-item="item"></my-navigation-subscription-item>')(scope)
            scope.$digest()
            page = new SubscriptionItemPage(element)
        }))

        describe('parent item', () => {

            it('should not mark as selected', inject($compile => {
                stateParams['feedTagEqual'] = null
                stateParams['feedUuidEqual'] = null

                element = $compile('<my-navigation-subscription-item my-item="item"></my-navigation-subscription-item>')(scope)
                scope.$digest()
                page = new SubscriptionItemPage(element)

                expect(page.parent.selected).toEqual(false)
            }))

            it('should mark as selected', () => {
                expect(page.parent.selected).toEqual(true)
            })

            it('should render title and unseen count', () => {
                expect(page.parent.text).toEqual('item title')
                expect(page.parent.badge).toEqual('2')
            })
        })

        describe('sub items', () => {

            it('should not render items when not selected', inject($compile => {
                stateParams['feedTagEqual'] = null
                stateParams['feedUuidEqual'] = null

                element = $compile(`<my-navigation-subscription-item my-item="item">
                                    </my-navigation-subscription-item>`)(scope)
                scope.$digest()
                page = new SubscriptionItemPage(element)

                expect(page.subList).toBeNull()
            }))

            it('should not render items when no subscriptions available', inject($compile => {
                scope.item = {...scope.item, subscriptions: []}

                element = $compile(`<my-navigation-subscription-item my-item="item">
                                    </my-navigation-subscription-item>`)(scope)
                scope.$digest()
                page = new SubscriptionItemPage(element)

                expect(page.subList).toBeNull()
            }))

            it('should render every item', () => {
                expect(page.subItems.length).toEqual(2)
            })

            it('should not mark as selected', () => {
                const items = page.subItems

                expect(items[0].selected).toEqual(false)
                expect(items[1].selected).toEqual(false)
            })

            it('should not render items when item is selected but subscriptions property is undefined', inject($compile => {
                scope.item = {...scope.item}
                delete scope.item.subscriptions
                element = $compile(`<my-navigation-subscription-item my-item="item"></my-navigation-subscription-item>`)(scope)
                scope.$digest()
                page = new SubscriptionItemPage(element)

                expect(page.subList).toBeNull()
            }))

            it('should mark as selected', () => {
                stateParams['feedTagEqual'] = scope.item.tag
                stateParams['feedUuidEqual'] = 'uuid1'
                scope.$digest()

                const items = page.subItems

                expect(items[0].selected).toEqual(true)
                expect(items[1].selected).toEqual(false)
            })

            it('should render item title with unseen count', () => {
                const item = page.subItems[0]

                expect(item.text).toEqual('subscription 1')
                expect(item.badge).toEqual('1')
            })
        })
    })
})
