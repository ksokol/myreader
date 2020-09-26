import React from 'react'
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import {SearchInput} from './SearchInput'

describe('SearchInput', () => {

  it('should set default value when prop "value" is undefined', () => {
    render(<SearchInput />)

    expect(screen.getByRole('search')).toBeVisible()
  })

  it('should set default value when prop "value" is null', () => {
    render(<SearchInput value={null} />)

    expect(screen.getByRole('search')).toBeVisible()
  })

  it('should set initial value', () => {
    render(<SearchInput value='expectedValue' />)

    expect(screen.getByRole('search')).toHaveValue('expectedValue')
  })

  it('should debounce input change event for a predefined amount of time', async () => {
    const onChange = jest.fn()
    render(<SearchInput onChange={onChange} />)
    fireEvent.change(screen.getByRole('search'), {target: {value: 'expectedValue'}})

    expect(screen.getByRole('search')).toHaveValue('expectedValue')
    expect(onChange).not.toHaveBeenCalledWith('expectedValue')

    await waitFor(
      () => expect(onChange).toHaveBeenCalledWith('expectedValue'),
      {
        timeout: 250,
        interval: 1
      }
    )
  })
})
