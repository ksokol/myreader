import React from 'react'
import TestRenderer from 'react-test-renderer'
import ReactTestUtils from 'react-dom/test-utils'
import Input from './input'
import * as ReactDOM from 'react-dom'

describe('src/app/js/shared/component/input/input.spec.js', () => {

  let props

  beforeEach(() => {
    props = {
      label: 'expectedLabel',
      name: 'expectedName',
      value: 'expectedValue',
      placeholder: 'expected placeholder',
      onChange: jest.fn()
    }
  })

  const createInstance = () => TestRenderer.create(<Input {...props} />)

  it('should render label when prop "label" is defined', () => {
    const instance = createInstance().root

    expect(instance.findByType('label')).toBeDefined()
    expect(instance.findByType('input')).toBeDefined()
  })

  it('should not render label when prop "label" is undefined', () => {
    props.label = undefined
    const instance = createInstance().root

    expect(instance.findAllByType('label').length).toEqual(0)
    expect(instance.findByType('input')).toBeDefined()
  })

  it('should pass expected props to label', () => {
    expect(createInstance().root.findByType('label').props).toEqual({
      htmlFor: 'expectedName',
      children: 'expectedLabel'
    })
  })

  it('should pass expected props to input', () => {
    const {onChange, ...props} = createInstance().root.findByType('input').props

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

    expect(createInstance().root.findByType('input').props).toContainObject({
      disabled: true
    })
  })

  it('should not disable input when prop "disabled" is false', () => {
    props.disabled = false

    expect(createInstance().root.findByType('input').props).toContainObject({
      disabled: false
    })
  })

  it('should trigger prop "onChange" function', () => {
    const instance = createInstance().root
    instance.findByType('input').props.onChange({target: {value: 'new value'}})

    expect(props.onChange).toHaveBeenCalledWith('new value')
  })

  it('should not throw error when prop "onChange" function is undefined', () => {
    props.onChange = undefined
    const instance = createInstance().root

    instance.findByType('input').props.onChange({target: {value: 'new value'}})
  })

  it('should merge prop "className"', () => {
    props.className = 'expected-class'
    const instance = createInstance().root

    expect(instance.children[0].props.className).toEqual('my-input expected-class')
  })

  it('should render prop "renderValidations" function', () => {
    props.renderValidations = () => 'expected validation'
    const instance = createInstance().root

    expect(instance.props.renderValidations()).toEqual('expected validation')
  })

  it('should not focus input field after mount', () => {
    const instance = ReactTestUtils.renderIntoDocument(<Input {...props} />)

    expect(document.activeElement).not.toEqual(instance)
  })

  it('should focus input field', () => {
    const instance = ReactTestUtils.renderIntoDocument(<Input {...props} />)
    ReactTestUtils.Simulate.focus(instance.myRef.current)

    expect(document.activeElement).toEqual(instance.myRef.current)
  })

  it('should restore focus when prop "disabled" changed back to true and input field was focused before', () => {
    const node = document.createElement('div')
    const instance = React.createRef()

    ReactDOM.render(<Input ref={instance} {...props} />, node)
    ReactTestUtils.Simulate.focus(instance.current.myRef.current)
    const focusSpy = jest.spyOn(instance.current.myRef.current, 'focus')

    props.disabled = true
    ReactDOM.render(<Input {...props} />, node)

    expect(focusSpy).not.toHaveBeenCalled()

    focusSpy.mockReset()
    props.disabled = false
    ReactDOM.render(<Input {...props} />, node)

    expect(focusSpy).toHaveBeenCalled()
  })
})
