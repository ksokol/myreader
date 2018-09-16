import React from 'react'
import Input from './Input'
import {shallow, mount} from 'enzyme'

describe('Input', () => {

  let props

  beforeEach(() => {
    props = {
      label: 'expectedLabel',
      name: 'expectedName',
      value: 'expectedValue',
      placeholder: 'expected placeholder',
      onChange: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn()
    }
  })

  const createShallow = () => shallow(<Input  {...props} />)
  const createMount = () => mount(<Input  {...props} />)

  it('should render label when prop "label" is defined', () => {
    const wrapper = createShallow()

    expect(wrapper.find('label').exists()).toEqual(true)
    expect(wrapper.find('input').exists()).toEqual(true)
  })

  it('should not render label when prop "label" is undefined', () => {
    props.label = undefined
    const wrapper = createShallow()

    expect(wrapper.find('label').exists()).toEqual(false)
    expect(wrapper.find('input').exists()).toEqual(true)
  })

  it('should pass expected props to label', () => {
    expect(createShallow().find('label').props()).toEqual({
      htmlFor: 'expectedName',
      children: 'expectedLabel'
    })
  })

  it('should pass expected props to input', () => {
    const {onChange, ...props} = createShallow().find('input').props()

    expect(onChange).toBeDefined()
    expect(props).toContainObject({
      type: 'text',
      id: 'expectedName',
      name: 'expectedName',
      value: 'expectedValue',
      placeholder: 'expected placeholder',
      autoComplete: 'off',
      disabled: false
    })
  })

  it('should disable input when prop "disabled" is true', () => {
    props.disabled = true

    expect(createShallow().find('input').prop('disabled')).toEqual(true)
  })

  it('should not disable input when prop "disabled" is false', () => {
    props.disabled = false

    expect(createShallow().find('input').prop('disabled')).toEqual(false)
  })

  it('should trigger prop "onChange" function', () => {
    createShallow().find('input').props().onChange({target: {value: 'new value'}})

    expect(props.onChange).toHaveBeenCalledWith('new value')
  })

  it('should not throw error when prop "onChange" function is undefined', () => {
    props.onChange = undefined

    createShallow().find('input').props().onChange({target: {value: 'new value'}})
  })

  it('should merge prop "className"', () => {
    props.className = 'expected-class'

    expect(createShallow().find('.my-input').prop('className')).toContain('expected-class')
  })

  it('should render prop "renderValidations" function', () => {
    props.renderValidations = () => <p>expected validation</p>

    expect(createShallow().find('input + p').text()).toEqual('expected validation')
  })

  it('should not focus input field after mount', () => {
    const wrapper = createShallow()

    expect(document.activeElement).not.toEqual(wrapper.instance())
  })

  it('should focus input field', () => {
    const wrapper = createMount()
    expect(document.activeElement).not.toEqual(wrapper.find('input').instance())

    wrapper.find('input').simulate('focus')
    expect(document.activeElement).toEqual(wrapper.find('input').instance())
  })

  it('should restore focus when prop "disabled" changed back to true and input field was focused before', () => {
    props.disabled = true
    const wrapper = createMount()
    const input = wrapper.find('input')
    const focusSpy = jest.spyOn(input.instance(), 'focus')

    input.simulate('focus')
    expect(focusSpy).not.toHaveBeenCalled()

    focusSpy.mockReset()
    wrapper.setProps({disabled: false})
    expect(focusSpy).toHaveBeenCalled()
  })

  it('should set input type value to "some-type"', () => {
    props.type = 'some-type'

    expect(createShallow().find('input').prop('type')).toEqual('some-type')
  })

  it('should set input autocomplete value to "some-autocomplete"', () => {
    props.autoComplete = 'some-autocomplete'

    expect(createShallow().find('input').prop('autoComplete')).toEqual('some-autocomplete')
  })

  it('should trigger prop "onFocus" function when input focused', () => {
    createMount().find('input').simulate('focus')

    expect(props.onFocus).toHaveBeenCalled()
  })

  it('should not throw an error when prop "onFocus" function is undefined', () => {
    props.onFocus = undefined

    createMount().find('input').simulate('focus')
  })

  it('should trigger prop "onBlur" function when input leaved', () => {
    const input = createMount().find('input')
    input.simulate('focus')
    input.simulate('blur')

    expect(props.onBlur).toHaveBeenCalled()
  })

  it('should not throw an error when prop "onBlur" function is undefined', () => {
    props.onBlur = undefined
    const input = createMount().find('input')

    input.simulate('focus')
    input.simulate('blur')
  })
})
