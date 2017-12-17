describe('src/app/js/navigation/subscription-item/subscription-item.component.spec.js', () => {

    beforeEach(angular.mock.module('myreader'))

    describe('$onInit', () => {

        let component

        it('should set default values', inject(_$componentController_ => {
            component = _$componentController_('myNavigationSubscriptionItem')
            component.$onInit()

            expect(component.item).toEqual({})
            expect(component.selected).toEqual({})
        }))

        it('should use bindings', inject(_$componentController_ => {
            const bindings = { myItem: 'expected myItem', mySelected: 'expected mySelected'}
            component = _$componentController_('myNavigationSubscriptionItem', null, bindings)
            component.$onInit()

            expect(component.item).toEqual('expected myItem')
            expect(component.selected).toEqual('expected mySelected')
        }))
    })

    describe('controller', () => {

        let component, bindings, myOnSelect

        beforeEach(inject(_$componentController_ => {
            myOnSelect = jasmine.createSpy('myOnSelect')

            bindings = {
                mySelected: {
                    tag: 'tag',
                    uuid: 'uuid'
                },
                myOnSelect: myOnSelect
            }

            component = _$componentController_('myNavigationSubscriptionItem', null, bindings)
            component.$onInit()
        }))

        it('should update selected on $onChanges', () => {
            const expected = {tag: 'expected tag', uuid: 'expected uuid'}
            component.$onChanges({mySelected: {currentValue: expected}})

            expect(component.selected).toEqual(expected)
        })

        it('should not update selected when mySelected is undefined in $onChanges', () => {
            component.$onChanges({})

            expect(component.selected).toEqual(bindings.mySelected)
        })

        it('should not mark item as selected when uuid does not match', () => {
            const item = {
                tag: bindings.mySelected.tag,
                uuid: 'other uuid'
            }

            expect(component.isSelected(item)).toEqual(false)
        })

        it('should not mark item as selected when tag does not match', () => {
            const item = {
                tag: 'other tag',
                uuid: bindings.mySelected.uuid
            }

            expect(component.isSelected(item)).toEqual(false)
        })

        it('should mark item as selected when tag and uuid match', () => {
            const item = {
                tag: bindings.mySelected.tag,
                uuid: bindings.mySelected.uuid
            }

            expect(component.isSelected(item)).toEqual(true)
        })

        it('should mark submenu as open when tag matches', inject(_$componentController_ => {
            bindings.myItem = {
                tag: bindings.mySelected.tag
            }

            component = _$componentController_('myNavigationSubscriptionItem', null, bindings)
            component.$onInit()

            expect(component.isOpen()).toEqual(true)
        }))

        it('should not mark submenu as open when tag does not match', inject(_$componentController_ => {
            bindings.myItem = {
                tag: 'other tag'
            }

            component = _$componentController_('myNavigationSubscriptionItem', null, bindings)
            component.$onInit()

            expect(component.isOpen()).toEqual(false)
        }))

        it('should propagate selected item', () => {
            component.onSelect('tag parameter', 'uuid parameter')

            expect(myOnSelect).toHaveBeenCalledWith({selected: { tag: 'tag parameter', uuid: 'uuid parameter'}})
        })

        it('should calculate proper visibility', () => {
            expect(component.isInvisible({})).toEqual(false)
            expect(component.isInvisible({unseen: 0})).toEqual(true)
            expect(component.isInvisible({unseen: -1})).toEqual(true)
            expect(component.isInvisible({unseen: 1})).toEqual(false)
        })

        it('should construct comparison value for ng-repeat track by', () =>
            expect(component.trackBy({uuid: '1', unseen: 2})).toEqual('{"uuid":"1","unseen":2}'))
    })

    describe('with html', () => {

        let scope, element, myOnSelect

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

        beforeEach(inject(($rootScope, $compile) => {
            myOnSelect = jasmine.createSpy('myOnSelect')

            scope = $rootScope.$new()
            scope.item = item
            scope.selected = {
                tag: scope.item.tag,
                uuid: scope.item.uuid
            }
            scope.onSelect = myOnSelect

            element = $compile(`<my-navigation-subscription-item my-item="item"
                                                                 my-selected="selected"
                                                                 my-on-select="onSelect(selected)">
                                </my-navigation-subscription-item>`)(scope)
            scope.$digest()
        }))

        describe('parent item', () => {

            it('should not mark as selected', inject($compile => {
                scope.selected = {}
                element = $compile(`<my-navigation-subscription-item my-item="item" 
                                                                     my-selected="selected">
                                    </my-navigation-subscription-item>`)(scope)
                scope.$digest()

                expect(element.find('li')[0].classList).not.toContain('my-navigation-dynamic__item')
            }))

            it('should mark as selected', () => {
                expect(element.find('li')[0].classList).toContain('my-navigation-dynamic__item')
            })

            it('should not hide when unseen count is greater than zero', () => {
                expect(element.find('li')[0].classList).not.toContain('ng-hide')
            })

            it('should hide when unseen count is zero', inject($compile => {
                scope.item = { unseen: 0 }
                scope.selected = {}

                element = $compile(`<my-navigation-subscription-item my-item="item" 
                                                                     my-selected="selected">
                                    </my-navigation-subscription-item>`)(scope)
                scope.$digest()

                expect(element.find('li')[0].classList).toContain('ng-hide')
            }))

            it('should propagate selection', () => {
                element.find('button')[0].click()
                scope.$digest()

                expect(myOnSelect).toHaveBeenCalledWith({ tag: 'tag', uuid: 'uuid' })
            })

            it('should render title and unseen count', () => {
                const div = angular.element(element.find('li')[0]).find('div')

                expect(div.find('div')[0].innerText).toEqual('item title')
                expect(angular.element(div.find('div')[1]).find('span').text()).toEqual('2')
            })

            it('should render title and no unseen count', () => {
                delete scope.item.unseen
                scope.$digest()

                const div = angular.element(element.find('li')[0]).find('div')
                expect(div.find('div')[0].innerText).toEqual('item title')
                expect(div.find('div')[1]).toBeUndefined()
            })
        })

        describe('sub items', () => {

            it('should hide items', inject($compile => {
                scope.selected = {}
                element = $compile(`<my-navigation-subscription-item my-item="item" 
                                                                     my-selected="selected">
                                    </my-navigation-subscription-item>`)(scope)
                scope.$digest()

                expect(element.find('ul')[0].classList).toContain('ng-hide')
            }))

            it('should not hide items', () => {
                expect(element.find('ul')[0].classList).not.toContain('ng-hide')
            })

            it('should render every item', () => {
                expect(element.find('ul').find('li').length).toEqual(2)
            })

            it('should not mark as selected', () => {
                const items = element.find('ul').find('li')

                expect(items[0].classList).not.toContain('my-navigation-dynamic__item')
                expect(items[1].classList).not.toContain('my-navigation-dynamic__item')
            })

            it('should mark as selected', () => {
                scope.selected = {
                    tag: scope.item.tag,
                    uuid: 'uuid1'
                }
                scope.$digest()

                const items = element.find('ul').find('li')

                expect(items[0].classList).toContain('my-navigation-dynamic__item')
                expect(items[1].classList).not.toContain('my-navigation-dynamic__item')
            })

            it('should propagate selection', () => {
                element.find('ul').find('li').find('button')[1].click()
                scope.$digest()

                expect(myOnSelect).toHaveBeenCalledWith({ tag: 'tag', uuid: 'uuid2' })
            })

            it('should render item title with unseen count', () => {
                const div1 = angular.element(angular.element(element.find('ul').find('button')[0]).find('div')).find('div')

                expect(div1[0].innerText).toEqual('subscription 1')
                expect(angular.element(div1[1]).find('span').text()).toEqual('1')
            })

            it('should render item title without unseen count', () => {
                const div2 = angular.element(angular.element(element.find('ul').find('button')[1]).find('div')).find('div')

                expect(div2[0].innerText).toEqual('subscription 2')
                expect(div2[1]).toBeUndefined()
            })
        })
    })
})
