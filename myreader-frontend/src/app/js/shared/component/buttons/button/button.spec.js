import React from 'react'
import TestRenderer from 'react-test-renderer'
import Button from './button'

describe('src/app/js/shared/component/buttons/button/button.spec.js', () => {

  let props

  beforeEach(() => {
    props = {
      onClick: jest.fn(),
      children: 'expected children'
    }
  })

  const createInstance = () => TestRenderer.create(<Button {...props} />).root

  it('should pass expected props with default values to button', () => {
    expect(createInstance().props).toContainObject({
      type: 'button',
      disabled: false,
      children: 'expected children'
    })
  })

  it('should pass expected props to button', () => {
    props.type = 'submit'
    props.disabled = true

    expect(createInstance().props).toContainObject({
      type: 'submit',
      disabled: true
    })
  })

  it('should trigger prop "onClick" function when button clicked', () => {
    createInstance().props.onClick()

    expect(props.onClick).toHaveBeenCalled()
  })
})
