import React from 'react'
import {mount} from 'enzyme'
import ColorPicker from './ColorPicker'

describe('ColorPicker', () => {

  let props

  const createComponent = () => mount(<ColorPicker {...props} />)

  beforeEach(() => {
    props = {
      color: '#FFF',
      onChange: jest.fn()
    }
  })

  it('should pass expected props to color picker', () => {
    const wrapper = createComponent()

    expect(wrapper.props()).toContainObject({
      color: '#FFF'
    })
  })

  it('should add color change event listener', () => {
    const wrapper = createComponent()

    expect(wrapper.instance().colorPicker.on.mock.calls[0][0]).toEqual('color:change')
  })

  it('should trigger function prop "onChange" when color picked', () => {
    const wrapper = createComponent()
    wrapper.instance().colorPicker.on.mock.calls[0][1]({
      hexString: 'expected hex'
    })

    expect(props.onChange).toHaveBeenCalledWith('expected hex')
  })

  it('should not throw an error when function prop "onChange" is undefined', () => {
    props = {}
    expect(() => createComponent().props().onChange({})).not.toThrow()
  })

  it('should remove color change event listener', () => {
    const wrapper = createComponent()
    const instance = wrapper.instance()
    wrapper.unmount()

    expect(instance.colorPicker.off.mock.calls[0][0]).toEqual('color:change')
  })

  it('should set default value when prop "color" is undefined', () => {
    props = {}
    expect(createComponent().instance().colorPicker.color).toEqual('#FFF')
  })
})
