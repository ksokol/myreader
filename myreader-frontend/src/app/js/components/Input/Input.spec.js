import React from 'react'
import {mount} from 'enzyme'
import {Input} from './Input'

describe('Input', () => {

  let props

  beforeEach(() => {
    props = {
      id: 'expectedId',
      type: 'expectedType',
      label: 'expectedLabel',
      name: 'expectedName',
      role: 'expectedRole',
      value: 'expectedValue',
      placeholder: 'expected placeholder',
      autoComplete: 'expectedAutocomplete',
      disabled: false,
      validations: [
        {field: 'expectedName', defaultMessage: 'expectedMessage1'},
        {field: 'expectedName', defaultMessage: 'expectedMessage2'}
      ],
      onChange: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn(),
      onEnter: jest.fn(),
      onKeyUp: jest.fn(),
      a: 'b',
      c: 'd',
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

  it('should pass expected props to label when prop "id" is defined', () => {
    expect(createComponent().find('label').props()).toEqual({
      htmlFor: 'expectedId',
      children: 'expectedLabel'
    })
  })

  it('should pass expected props to label when prop "id" is undefined', () => {
    props.id = undefined

    expect(createComponent().find('label').props()).toEqual({
      htmlFor: 'expectedName',
      children: 'expectedLabel'
    })
  })

  it('should pass expected props to input', () => {
    const {onChange, onBlur, onKeyUp, onFocus, ...props} = createComponent().find('input').props()

    expect(onChange).toBeDefined()
    expect(onBlur).toBeDefined()
    expect(onKeyUp).toBeDefined()
    expect(onFocus).toBeDefined()

    expect(props).toEqual(expect.objectContaining({
      type: 'expectedType',
      id: 'expectedId',
      name: 'expectedName',
      role: 'expectedRole',
      value: 'expectedValue',
      placeholder: 'expected placeholder',
      autoComplete: 'expectedAutocomplete',
      disabled: false,
      a: 'b',
      c: 'd'
    }))
  })

  it('should pass expected props to input when prop "id" is undefined', () => {
    props.id = undefined

    expect(createComponent().find('input').prop('id')).toEqual('expectedName')
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
    props.id = undefined
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

  it('should add error class when prop "validations" contains error for prop "name"', () => {
    expect(createComponent().children().prop('className')).toContain('my-input--error')
  })

  it('should not add error class when prop "validations" is undefined', () => {
    props.validations = undefined

    expect(createComponent().children().prop('className')).not.toContain('my-input--error')
  })

  it('should render last validation for prop "name"', () => {
    expect(createComponent().find('.my-input__validations').html())
      .toEqual('<div class="my-input__validations" role="validations"><span>expectedMessage2</span></div>')
  })

  it('should not render last validation when prop "validations" is undefined', () => {
    props.validations = undefined

    expect(createComponent().find('.my-input__validations').exists()).toBe(false)
  })

  it('should render last validation belonging to the same prop "name"', () => {
    props.validations = [
      {field: 'expectedName', defaultMessage: 'expectedMessage1'},
      {field: 'otherName', defaultMessage: 'expectedMessage2'}
    ]

    expect(createComponent().find('.my-input__validations').html())
      .toEqual('<div class="my-input__validations" role="validations"><span>expectedMessage1</span></div>')
  })

  it('should clear validations when input changed', () => {
    const wrapper = createComponent()
    wrapper.find('input').simulate('change', {target: {value: 't'}})

    expect(wrapper.find('.my-input__validations').exists()).toBe(false)
  })

  it('should remove error class when input changed', () => {
    const wrapper = createComponent()
    wrapper.find('input').simulate('change', {target: {value: 't'}})

    expect(wrapper.children().prop('className')).not.toContain('my-input--error')
  })

  it('should not render last validation when prop "value" changed', () => {
    const wrapper = createComponent()
    wrapper.find('input').simulate('change', {target: {value: 't'}})
    wrapper.setProps({value: 't'})

    expect(wrapper.find('.my-input__validations').exists()).toBe(false)
  })

  it('should render last validation when prop "validations" changed although the values stays the same', () => {
    const wrapper = createComponent()
    wrapper.find('input').simulate('change', {target: {value: 't'}})
    wrapper.setProps({validations: [...props.validations]})

    expect(wrapper.find('.my-input__validations').html())
      .toEqual('<div class="my-input__validations" role="validations"><span>expectedMessage2</span></div>')
  })
})
