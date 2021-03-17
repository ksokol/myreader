import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import Button from './Button'

const buttonText = 'button text'

describe('Button', () => {

  let props

  const renderComponent = () => {
    render(<Button {...props} />)
  }

  beforeEach(() => {
    props = {
      type: 'submit',
      className: 'expected-class',
      onClick: jest.fn(),
      children: buttonText
    }
  })

  it('should pass expected props with default values to button', () => {
    renderComponent()

    expect(screen.getByText(buttonText)).toHaveClass('my-button expected-class')
    expect(screen.getByText(buttonText)).toHaveAttribute('type', 'submit')
    expect(screen.getByText(buttonText)).toBeEnabled()
  })

  it('should add primary class when prop "primary" is set to true', () => {
    props.primary = true
    props.className = undefined

    renderComponent()

    expect(screen.getByText(buttonText)).toHaveClass('my-button my-button--primary')
  })

  it('should add caution class when prop "caution" is set to true', () => {
    props.caution = true
    props.className = undefined

    renderComponent()

    expect(screen.getByText(buttonText)).toHaveClass('my-button my-button--caution')
  })

  it('should pass expected props to button', () => {
    props.disabled = true

    renderComponent()

    expect(screen.getByText(buttonText)).toBeDisabled()
  })

  it('should trigger prop function "onClick" function when button clicked', () => {
    renderComponent()

    fireEvent.click(screen.getByText(buttonText))

    expect(props.onClick).toHaveBeenCalled()
  })
})
