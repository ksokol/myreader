import React from 'react'
import {mount} from 'enzyme'
import iro from '@jaames/iro'
import ColorPicker from './ColorPicker'

describe('ColorPicker', () => {

  let props, colorPicker

  const createComponent = () => mount(<ColorPicker {...props} />)

  beforeEach(() => {
    colorPicker = {
      _mount: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    }

    iro.ColorPicker.prototype = colorPicker

    props = {
      color: '#FF',
      onChange: jest.fn()
    }
  })

  it('should pass expected props to color picker', () => {
    const wrapper = createComponent()

    expect(wrapper.props()).toContainObject({
      color: '#FF'
    })
  })

  it('should add color change event listener', () => {
    createComponent()

    expect(colorPicker.on.mock.calls[0][0]).toEqual('color:change')
  })

  it('should trigger function prop "onChange" when color picked', () => {
    createComponent()
    colorPicker.on.mock.calls[0][1]({
      hexString: 'expected hex'
    })

    expect(props.onChange).toHaveBeenCalledWith('expected hex')
  })

  it('should not throw an error when function prop "onChange" is undefined', () => {
    props = {}
    expect(() => createComponent().props().onChange({})).not.toThrow()
  })

  it('should remove color change event listener', () => {
    createComponent().unmount()

    expect(colorPicker.off.mock.calls[0][0]).toEqual('color:change')
  })
})
