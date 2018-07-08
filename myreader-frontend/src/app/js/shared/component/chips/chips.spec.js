import React from 'react'
import ReactTestUtils from 'react-dom/test-utils'
import {shallow} from '../../test-utils'
import Chips from './chips'

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

    let props

    beforeEach(() => {
      props = {
        keyFn: value => `keyFn: ${value}`,
        values: ['value1', 'value2'],
        selected: 'value2',
        placeholder: 'expected placeholder',
        onSelect: jest.fn(),
        onRemove: jest.fn(),
        renderItem: value => `rendered: ${value}`
      }
    })

    it('should create a chip component instance for every value in prop "values"', () => {
      const {output} = shallow(<Chips {...props} />)
      const children = output().props.children[0].props.children

      expect(children[0]).toContainObject({
        key: 'keyFn: value1',
        props: {
          value: 'value1',
          selected: 'value2',
          disabled: false,
          children: 'rendered: value1',
          onSelect: props.onSelect,
          onRemove: props.onRemove
        }
      })

      expect(children[1]).toContainObject({
        key: 'keyFn: value2',
        props: {
          value: 'value2',
          selected: 'value2',
          disabled: false,
          children: 'rendered: value2',
          onSelect: props.onSelect,
          onRemove: props.onRemove
        }
      })
    })

    it('should return key from prop "keyFn" function for every chip component instance' , () => {
      const {output} = shallow(<Chips {...props} />)
      const children = output().props.children[0].props.children

      expect(children[0].props.keyFn()).toEqual('keyFn: value1')
      expect(children[1].props.keyFn()).toEqual('keyFn: value2')
    })

    it('should not render input component when prop "onAdd" function is undefined', () => {
      const {output} = shallow(<Chips {...props} />)

      expect(output().props.children[1]).toBeUndefined()
    })

    it('should render input component when prop "onAdd" function is defined', () => {
      props.onAdd = jest.fn()
      const {output} = shallow(<Chips {...props} />)

      expect(output().props.children[1]).toBeDefined()
    })

    it('should pass expected props to input component', () => {
      props.onAdd = jest.fn()
      const {output} = shallow(<Chips {...props} />)

      expect(output().props.children[1].props.children.props).toContainObject({
        disabled: false,
        placeholder: 'expected placeholder',
        value: ''
      })
    })

    it('should trigger prop "onAdd" function when input value changed and enter key pressed', () => {
      props.onAdd = jest.fn()
      const {output} = shallow(<Chips {...props} />)
      const hotkeysProps = output().props.children[1].props

      hotkeysProps.children.props.onChange('expected value')
      hotkeysProps.onKeys.enter()

      expect(props.onAdd).toHaveBeenCalledWith('expected value')
    })

    it('should not trigger prop "onAdd" function when input value is an empty string and enter key pressed', () => {
      props.onAdd = jest.fn()
      const {output} = shallow(<Chips {...props} />)
      const hotkeysProps = output().props.children[1].props

      hotkeysProps.children.props.onChange('')
      hotkeysProps.onKeys.enter()

      expect(props.onAdd).not.toHaveBeenCalled()
    })

    it('should reset prop "value" of input component when input value changed and enter key pressed', () => {
      props.onAdd = jest.fn()
      const {output} = shallow(<Chips {...props} />)
      let hotkeysProps = output().props.children[1].props

      hotkeysProps.children.props.onChange('expected value')
      hotkeysProps.onKeys.enter()
      hotkeysProps = output().props.children[1].props

      expect(hotkeysProps.children.props).toContainObject({value: ''})
    })

    it('should not reset prop "value" of input component when input value changed but enter key not pressed', () => {
      props.onAdd = jest.fn()
      const {output} = shallow(<Chips {...props} />)
      let hotkeysProps = output().props.children[1].props

      hotkeysProps.children.props.onChange('expected value')
      hotkeysProps = output().props.children[1].props

      expect(hotkeysProps.children.props).toContainObject({value: 'expected value'})
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
