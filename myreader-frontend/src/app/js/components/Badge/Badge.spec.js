import React from 'react'
import {render, screen} from '@testing-library/react'
import {Badge} from './Badge'

describe('Badge', () => {

  it('should render component with given text', () => {
    render(<Badge text='sample text' />)

    expect(screen.getByText('sample text')).toBeInTheDocument()
  })

  it('should set CSS custom properties red, green and blue with default value', () => {
    render(<Badge />)

    expect(screen.getByRole('badge')).toHaveStyle('--red: 119; --green: 119; --blue: 119;')
  })

  it('should set CSS custom properties red, green and blue', () => {
    render(<Badge color='#77A7EA' />)

    expect(screen.getByRole('badge')).toHaveStyle('--red: 119; --green: 167; --blue: 234;')
  })

  it('should update CSS custom properties red, green and blue when prop "color" changed', () => {
    const {rerender} = render(<Badge color='#77A7EA' />)
    rerender(<Badge color='#70CEE6' />)

    expect(screen.getByRole('badge')).toHaveStyle('--red: 112; --green: 206; --blue: 230;')
  })
})
