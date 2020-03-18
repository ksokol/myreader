import React from 'react'
import {mount} from 'enzyme'
import {Input} from './Input'

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
      onBlur: jest.fn(),
      onEnter: jest.fn(),
      a: 'b',
      c: 'd'
    }
  })

  const createComponent = () => mount(<Input  {...props} />)

  it('should render label when prop "label" is defined', () => {
    const wrapper = createComponent()

    expect(wrapper.find('label').exists()).toEqual(true)
    expect(wrapper.find('input').exists()).toEqual(true)
  })

  it('should not render label when prop "label" is undefined', () => {
    delete props.label
    const wrapper = createComponent()

    expect(wrapper.find('label').exists()).toEqual(false)
    expect(wrapper.find('input').exists()).toEqual(true)
  })

  it('should pass expected props to label', () => {
    expect(createComponent().find('label').props()).toEqual({
      htmlFor: 'expectedName',
      children: 'expectedLabel'
    })
  })

  it('should pass expected props to input', () => {
    const {onChange, ...props} = createComponent().find('input').props()

    expect(onChange).toBeDefined()
    expect(props).toContainObject({
      type: 'text',
      id: 'expectedName',
      name: 'expectedName',
      value: 'expectedValue',
      placeholder: 'expected placeholder',
      autoComplete: 'off',
      disabled: false,
      a: 'b',
      c: 'd'
    })
  })

  it('should disable input when prop "disabled" is true', () => {
    props.disabled = true

    expect(createComponent().find('input').prop('disabled')).toEqual(true)
  })

  it('should not disable input when prop "disabled" is false', () => {
    props.disabled = false

    expect(createComponent().find('input').prop('disabled')).toEqual(false)
  })

  it('should trigger prop "onChange" function', () => {
    createComponent().find('input').props().onChange({target: {value: 'new value'}})

    expect(props.onChange).toHaveBeenCalledWith({target: {value: 'new value'}})
  })

  it('should not throw error when prop "onChange" function is undefined', () => {
    delete props.onChange

    createComponent().find('input').props().onChange({target: {value: 'new value'}})
  })

  it('should merge prop "className"', () => {
    props.className = 'expected-class'

    expect(createComponent().find('.my-input').prop('className')).toContain('expected-class')
  })

  it('should render prop "renderValidations" function', () => {
    /* eslint-disable react/display-name */
    props.renderValidations = () => <p>expected validation</p>
    /* eslint-enable */

    expect(createComponent().find('input + p').text()).toEqual('expected validation')
  })

  it('should not focus input field after mount', () => {
    const wrapper = createComponent()

    expect(document.activeElement).not.toEqual(wrapper.instance())
  })

  it('should focus input field', () => {
    const wrapper = createComponent()
    const {inputRef} = wrapper.instance()
    jest.spyOn(inputRef.current, 'focus')

    expect(inputRef.current.focus).not.toHaveBeenCalled()

    wrapper.find('input').simulate('focus')
    expect(inputRef.current.focus).toHaveBeenCalledTimes(1)
  })

  it('should restore focus when prop "disabled" changed back to true and input field was focused before', () => {
    props.disabled = true
    const wrapper = createComponent()
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

    expect(createComponent().find('input').prop('type')).toEqual('some-type')
  })

  it('should set input autocomplete value to "some-autocomplete"', () => {
    props.autoComplete = 'some-autocomplete'

    expect(createComponent().find('input').prop('autoComplete')).toEqual('some-autocomplete')
  })

  it('should trigger prop "onFocus" function when input focused', () => {
    createComponent().find('input').simulate('focus')

    expect(props.onFocus).toHaveBeenCalled()
  })

  it('should not throw an error when prop "onFocus" function is undefined', () => {
    delete props.onFocus

    createComponent().find('input').simulate('focus')
  })

  it('should trigger prop "onBlur" function when input leaved', () => {
    const input = createComponent().find('input')
    input.simulate('focus')
    input.simulate('blur')

    expect(props.onBlur).toHaveBeenCalled()
  })

  it('should not throw an error when prop "onBlur" function is undefined', () => {
    delete props.onBlur
    const input = createComponent().find('input')

    input.simulate('focus')
    input.simulate('blur')
  })

  it('should link label with input based on prop "name" when prop "id" is not present', () => {
    const wrapper = createComponent()

    expect(wrapper.find('label').prop('htmlFor')).toEqual('expectedName')
    expect(wrapper.find('input').prop('id')).toEqual('expectedName')
  })

  it('should link label with input based on prop "id"', () => {
    const expectedId = 'expected id'
    props.id = expectedId
    const wrapper = createComponent()

    expect(wrapper.find('label').prop('htmlFor')).toEqual(expectedId)
    expect(wrapper.find('input').prop('id')).toEqual(expectedId)
  })

  it('should not throw an exception when enter key pressed and prop function "onEnter" is undefined', () => {
    delete props.onEnter

    expect(() => createComponent().find('input').simulate('keyUp', {key: 'Enter'})).not.toThrow()
  })

  it('should trigger prop function "onEnter" when enter key pressed', () => {
    createComponent().find('input').simulate('keyUp', {key: 'Enter', a: 'b'})

    expect(props.onEnter).toHaveBeenCalledWith(expect.objectContaining({key: 'Enter', a: 'b'}))
  })

  it('should not trigger prop function "onEnter" when esc key pressed', () => {
    createComponent().find('input').simulate('keyUp', {key: 'Esc'})

    expect(props.onEnter).not.toHaveBeenCalled()
  })
})
