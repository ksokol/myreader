import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import {Chips} from './Chips'

const expectedValue = 'expected value'

describe('Chips', () => {

  let props

  const renderComponent = () => {
    return render(<Chips {...props} />)
  }

  beforeEach(() => {
    props = {
      keyFn: value => `keyFn: ${value}`,
      values: ['value1', 'value2'],
      placeholder: 'expected placeholder',
      onAdd: jest.fn(),
      onRemove: jest.fn(),
      renderItem: value => `rendered: ${value}`
    }
  })

  it('should render chips', () => {
    renderComponent()

    expect(screen.getByText('rendered: value1')).toBeInTheDocument()
    expect(screen.getAllByRole('chip-remove-button')[0]).toBeEnabled()
    expect(screen.getByText('rendered: value2')).toBeInTheDocument()
    expect(screen.getAllByRole('chip-remove-button')[1]).toBeEnabled()
  })

  it('should not render input if prop function "onAdd" is undefined', () => {
    props.onAdd = undefined
    renderComponent()

    expect(screen.queryByPlaceholderText('expected placeholder')).not.toBeInTheDocument()
  })

  it('should render input if prop function "onAdd" is defined', () => {
    renderComponent()

    expect(screen.getByPlaceholderText('expected placeholder')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('expected placeholder')).toBeEnabled()
    expect(screen.getByPlaceholderText('expected placeholder')).toHaveValue('')
  })

  it('should trigger prop function "onAdd" if input value changed and enter key pressed', () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText('expected placeholder'), {target: {value: expectedValue}})
    fireEvent.keyUp(screen.getByPlaceholderText('expected placeholder'), {key: 'Enter', keyCode: 13})

    expect(props.onAdd).toHaveBeenCalledWith(expectedValue)
  })

  it('should not trigger prop function "onAdd" if input value is an empty string and enter key pressed', () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText('expected placeholder'), {target: {value: ''}})
    fireEvent.keyUp(screen.getByPlaceholderText('expected placeholder'), {key: 'Enter', keyCode: 13})

    expect(props.onAdd).not.toHaveBeenCalled()
  })

  it('should reset prop "value" of input if input value changed and enter key pressed', () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText('expected placeholder'), {target: {value: expectedValue}})
    fireEvent.keyUp(screen.getByPlaceholderText('expected placeholder'), {key: 'Enter', keyCode: 13})

    expect(screen.getByPlaceholderText('expected placeholder')).toHaveValue('')
  })

  it('should not reset prop "value" of input if input value changed but enter key not pressed', () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText('expected placeholder'), {target: {value: expectedValue}})

    expect(screen.getByPlaceholderText('expected placeholder')).toHaveValue(expectedValue)
  })

  it('should not render remove button if prop function "onRemove" function is undefined', () => {
    props.onRemove = undefined
    renderComponent()

    expect(screen.queryByRole('chip-remove-button')).not.toBeInTheDocument()
  })

  it('should disable remove button if prop "disabled" is true', () => {
    props.disabled = true
    renderComponent()

    expect(screen.getAllByRole('chip-remove-button')[0]).toBeDisabled()
    expect(screen.getAllByRole('chip-remove-button')[1]).toBeDisabled()
  })

  it('should trigger prop function "onRemove" if remove button component clicked', () => {
    renderComponent()

    fireEvent.click(screen.getAllByRole('chip-remove-button')[0])

    expect(props.onRemove).toHaveBeenCalledWith('value1')
  })
})
