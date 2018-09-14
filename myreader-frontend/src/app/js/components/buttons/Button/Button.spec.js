import React from 'react'
import {shallow} from 'enzyme'
import Button from './Button'

describe('src/app/js/components/buttons/Button/Button.spec.js', () => {

  let props

  beforeEach(() => {
    props = {
      className: 'expected-class',
      onClick: jest.fn(),
      children: 'expected children'
    }
  })

  const shallowRender = () => shallow(<Button {...props} />)

  it('should pass expected props with default values to button', () => {
    expect(shallowRender().find('button').props()).toContainObject({
      type: 'button',
      className: 'my-button expected-class',
      disabled: false,
      children: 'expected children'
    })
  })

  it('should pass expected props to button', () => {
    props.type = 'submit'
    props.disabled = true

    expect(shallowRender().find('button').props()).toContainObject({
      type: 'submit',
      disabled: true
    })
  })

  it('should trigger prop "onClick" function when button clicked', () => {
    shallowRender().find('button').props().onClick()

    expect(props.onClick).toHaveBeenCalled()
  })
})
