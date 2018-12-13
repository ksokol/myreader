import React from 'react'
import {shallow} from 'enzyme'
import Button from './Button'

describe('Button', () => {

  let props

  beforeEach(() => {
    props = {
      className: 'expected-class',
      onClick: jest.fn(),
      children: 'expected children'
    }
  })

  const createComponent = () => shallow(<Button {...props} />)

  it('should pass expected props with default values to button', () => {
    expect(createComponent().find('button').props()).toContainObject({
      type: 'button',
      className: 'my-button expected-class',
      disabled: false,
      children: 'expected children'
    })
  })

  it('should add primary class when prop "primary" is set to true', () => {
    props.primary = true
    props.className = undefined

    expect(createComponent().find('button').prop('className')).toEqual('my-button my-button--primary')
  })

  it('should add caution class when prop "caution" is set to true', () => {
    props.caution = true
    props.className = undefined

    expect(createComponent().find('button').prop('className')).toEqual('my-button my-button--caution')
  })

  it('should pass expected props to button', () => {
    props.type = 'submit'
    props.disabled = true

    expect(createComponent().find('button').props()).toContainObject({
      type: 'submit',
      disabled: true
    })
  })

  it('should trigger prop function "onClick" function when button clicked', () => {
    createComponent().find('button').props().onClick()

    expect(props.onClick).toHaveBeenCalled()
  })
})
