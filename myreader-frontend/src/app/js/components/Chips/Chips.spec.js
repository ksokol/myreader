import React from 'react'
import Chips from './Chips'
import {shallow} from 'enzyme'
import Chip from './Chip'
import {Hotkeys, Input} from '..'

describe('src/app/js/components/Chips/Chips.spec.js', () => {

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

  const createShallow = () => shallow(<Chips {...props} />)

  it('should create a chip component instance for every value in prop "values"', () => {
    const children = createShallow().find(Chip)

    expect(children.at(0).props()).toContainObject({
      value: 'value1',
      selected: 'value2',
      disabled: false,
      children: 'rendered: value1',
      onSelect: props.onSelect,
      onRemove: props.onRemove
    })

    expect(children.at(1).props()).toContainObject({
      value: 'value2',
      selected: 'value2',
      disabled: false,
      children: 'rendered: value2',
      onSelect: props.onSelect,
      onRemove: props.onRemove
    })
  })

  it('should return key from prop "keyFn" function for every chip component instance' , () => {
    const children = createShallow().find(Chip)

    expect(children.at(0).key()).toEqual('keyFn: value1')
    expect(children.at(1).key()).toEqual('keyFn: value2')
  })

  it('should not render input component when prop "onAdd" function is undefined', () => {
    const hotkeys = createShallow().find(Hotkeys)

    expect(hotkeys.exists()).toEqual(false)
  })

  it('should render input component when prop "onAdd" function is defined', () => {
    props.onAdd = jest.fn()
    const hotkeys = createShallow().find(Hotkeys)

    expect(hotkeys.exists()).toEqual(true)
  })

  it('should pass expected props to input component', () => {
    props.onAdd = jest.fn()
    const input = createShallow().find(Input)

    expect(input.props()).toContainObject({
      disabled: false,
      placeholder: 'expected placeholder',
      value: ''
    })
  })

  it('should trigger prop "onAdd" function when input value changed and enter key pressed', () => {
    props.onAdd = jest.fn()
    const wrapper = createShallow()
    const hotkeys = wrapper.find(Hotkeys)
    const input = wrapper.find(Input)

    input.props().onChange('expected value')
    hotkeys.props().onKeys.enter()

    expect(props.onAdd).toHaveBeenCalledWith('expected value')
  })

  it('should not trigger prop "onAdd" function when input value is an empty string and enter key pressed', () => {
    props.onAdd = jest.fn()
    const wrapper = createShallow()
    const hotkeys = wrapper.find(Hotkeys)
    const input = wrapper.find(Input)

    input.props().onChange('')
    hotkeys.props().onKeys.enter()

    expect(props.onAdd).not.toHaveBeenCalled()
  })

  it('should reset prop "value" of input component when input value changed and enter key pressed', () => {
    props.onAdd = jest.fn()
    const wrapper = createShallow()
    const hotkeys = wrapper.find(Hotkeys)
    const input = wrapper.find(Input)

    input.props().onChange('expected value')
    hotkeys.props().onKeys.enter()

    expect(wrapper.find(Input).prop('value')).toEqual('')
  })

  it('should not reset prop "value" of input component when input value changed but enter key not pressed', () => {
    props.onAdd = jest.fn()
    const wrapper = createShallow()
    const input = wrapper.find(Input)

    input.props().onChange('expected value')

    expect(wrapper.find(Input).prop('value')).toEqual('expected value')
  })
})
