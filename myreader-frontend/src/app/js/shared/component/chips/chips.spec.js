import React from 'react'
import ReactTestUtils from 'react-dom/test-utils'
import {shallowOutput} from '../../test-utils'
import {Chips} from './chips'

class ChipPageObject {

    constructor(el) {
        this.el = el
    }

    get selected() {
        return this.el.children()[0].classList.contains('my-chip--selected')
    }

    get selectable() {
        return this.el.children()[0].classList.contains('my-chip--selectable')
    }

    innerHtml() {
        return this.el.children()[0].innerHTML
    }

    click() {
        this.el.children()[0].click()
    }

    removeButton() {
        return this.el.find('button')[0]
    }
}

class ChipsPageObject {

    constructor(el) {
        this.el = el
    }

    chips() {
        return Object.values(this.el.find('my-chip')).map(it => new ChipPageObject(angular.element(it)))
    }

    chipsInput() {
        return this.el.find('input')
    }
}

describe('src/app/js/shared/component/chips/chips.spec.js', () => {

    describe('react', () => {

        it('should create Chip from every value', () => {
            const props = {
                values: ['value1', 'value2'],
                selected: 'value2',
                onSelect: () => null
            }
            const children = shallowOutput(<Chips {...props} />).props.children
            expect(children[0].props).toContainObject({value: 'value1', selected: 'value2', onSelect: props.onSelect})
            expect(children[1].props).toContainObject({value: 'value2', selected: 'value2', onSelect: props.onSelect})
        })

    })

    describe('angularjs', () => {

        let scope, chips

        beforeEach(angular.mock.module('myreader'))

        beforeEach(inject($rootScope => scope = $rootScope.$new(true)))

        describe('', () => {

            beforeEach(inject($compile => {
                scope.values = ['chip1', 'chip2', 'chip3']
                scope.selected = 'chip2'
                scope.onSelect = jest.fn()

                const element = $compile(`<my-chips my-selected="selected"
                                                my-on-select="onSelect(key)">
                                          <my-chip ng-repeat="value in values" my-key="value">{{value}}</my-chip>
                                      </my-chips>`)(scope)
                scope.$digest()
                chips = new ChipsPageObject(element)
            }))

            it('should transclude chip content', () => {
                expect(chips.chips()[0].innerHtml()).toEqual('chip1')
                expect(chips.chips()[1].innerHtml()).toEqual('chip2')
                expect(chips.chips()[2].innerHtml()).toEqual('chip3')
            })

            it('should mark chip as selected', () => {
                expect(chips.chips()[0].selected).toEqual(false)
                expect(chips.chips()[1].selected).toEqual(true)
                expect(chips.chips()[2].selected).toEqual(false)
            })

            it('should trigger onSelect when chip clicked', () => {
                chips.chips()[2].click()

                expect(scope.onSelect).toHaveBeenCalledWith('chip3')
            })

            it('should not trigger onSelect when chip is already selected', () => {
                chips.chips()[1].click()

                expect(scope.onSelect).not.toHaveBeenCalled()
            })

            it('should not show remove button when onRemove function is not defined', () => {
                expect(chips.chips()[0].removeButton()).toBeUndefined()
                expect(chips.chips()[1].removeButton()).toBeUndefined()
                expect(chips.chips()[2].removeButton()).toBeUndefined()
            })

            it('should mark chip as selectable when onSelect function is defined', () => {
                expect(chips.chips()[0].selectable).toEqual(true)
                expect(chips.chips()[1].selectable).toEqual(true)
                expect(chips.chips()[2].selectable).toEqual(true)
            })
        })

        describe('', () => {

            beforeEach(inject($compile => {
                scope.values = ['chip1', 'chip2', 'chip3']
                scope.onRemove = jest.fn()

                const element = $compile(`<my-chips my-disabled="disabled"
                                                my-on-remove="onRemove(key)">
                                          <my-chip ng-repeat="value in values" my-key="value">{{value}}</my-chip>
                                      </my-chips>`)(scope)
                scope.$digest()
                chips = new ChipsPageObject(element)
            }))

            it('should show remove button when onRemove function is defined', () => {
                expect(chips.chips()[0].removeButton()).toBeDefined()
                expect(chips.chips()[1].removeButton()).toBeDefined()
                expect(chips.chips()[2].removeButton()).toBeDefined()
            })

            it('should emit onRemove event when chip has been clicked', () => {
                ReactTestUtils.Simulate.click(chips.chips()[1].removeButton())

                expect(scope.onRemove).toHaveBeenCalledWith('chip2')
            })

            it('should hide remove button when chips have been disabled', () => {
                scope.disabled = true
                scope.$digest()

                expect(chips.chips()[0].removeButton()).toBeUndefined()
                expect(chips.chips()[1].removeButton()).toBeUndefined()
                expect(chips.chips()[2].removeButton()).toBeUndefined()
            })

            it('show not show chips input when onAdd function is undefined', () =>
                expect(chips.chipsInput()[0]).toBeUndefined())

            it('should not mark chip as selectable when onSelect function is undefined', () => {
                expect(chips.chips()[0].selectable).toEqual(false)
                expect(chips.chips()[1].selectable).toEqual(false)
                expect(chips.chips()[2].selectable).toEqual(false)
            })
        })

        describe('', () => {

            beforeEach(inject($compile => {
                scope.values = []
                scope.placeholder = 'expected placeholder'
                scope.onAdd = jest.fn()
                scope.onRemove = jest.fn()

                const element = $compile(`<my-chips my-placeholder="placeholder"
                                                my-disabled="disabled"
                                                my-on-remove="onRemove(key)"
                                                my-on-add="onAdd(value)">
                                          <my-chip ng-repeat="value in values" my-key="value">{{value}}</my-chip>
                                      </my-chips>`)(scope)
                scope.$digest()
                chips = new ChipsPageObject(element)
            }))

            it('should emit entered value in chips input when enter key pressed', () => {
                chips.chipsInput().val('expected-value').triggerHandler('input')
                chips.chipsInput().triggerHandler({type: 'keyup', keyCode: 13})
                scope.$digest()

                expect(scope.onAdd).toHaveBeenCalledWith('expected-value')
            })

            it('should not emit entered value in chips input when enter key not pressed', () => {
                chips.chipsInput().val('a-value').triggerHandler('input')
                chips.chipsInput().triggerHandler({type: 'keyup', keyCode: 65})
                scope.$digest()

                expect(scope.onAdd).not.toHaveBeenCalled()
            })

            it('should not emit value in chips input when enter key pressed but but input value is empty', () => {
                chips.chipsInput().triggerHandler({type: 'keyup', keyCode: 13})
                scope.$digest()

                expect(scope.onAdd).not.toHaveBeenCalled()
            })

            it('should set chips input into readonly mode', () => {
                scope.disabled = true
                scope.$digest()
                expect(chips.chipsInput().attr('readonly')).toEqual('readonly')
            })

            it('should show given placeholder value in chips input', () =>
                expect(chips.chipsInput().attr('placeholder')).toEqual('expected placeholder'))

            it('should show changed placeholder value in chips input', () => {
                scope.placeholder = 'another placeholder'
                scope.$digest()
                expect(chips.chipsInput().attr('placeholder')).toEqual('another placeholder')
            })
        })
    })
})
