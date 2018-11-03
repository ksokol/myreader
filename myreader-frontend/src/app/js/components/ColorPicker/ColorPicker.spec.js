import React from 'react'
import {shallow} from 'enzyme'
import ColorPicker from './ColorPicker'
import colorPalette from './colorPalette'

describe('ColorPicker', () => {

  let props

  const createComponent = () => shallow(<ColorPicker {...props} />)

  beforeEach(() => {
    props = {
      onChange: jest.fn()
    }
  })

  it('should pass expected props to color picker', () => {
    const wrapper = createComponent()

    expect(wrapper.props()).toContainObject({
      className: 'my-color-picker',
      colors: colorPalette,
      triangle: 'hide'
    })
  })

  it('should trigger function prop "onChange" when color picked', () => {
    createComponent().props().onChange({hex: 'expected hex'})

    expect(props.onChange).toHaveBeenCalledWith('expected hex')
  })

  it('should not throw an error when function prop "onChange" is undefined', () => {
    props = {}
    expect(() => createComponent().props().onChange({})).not.toThrow()
  })
})
