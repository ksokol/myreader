import {render, screen, fireEvent} from '@testing-library/react'
import {IconButton} from './IconButton'

describe('IconButton', () => {

  it('should contain expected props', () => {
    render(<IconButton className='expected-className' type='chevron-right' disabled={true} />)

    expect(screen.getByRole('button-chevron-right')).toHaveClass('my-icon-button expected-className')
    expect(screen.getByRole('button-chevron-right')).toHaveAttribute('type', 'button')
    expect(screen.getByRole('button-chevron-right')).toBeDisabled()
  })

  it('should pass expected props to Icon component', () => {
    render(<IconButton type='chevron-right' inverse={true} />)

    expect(screen.getByRole('button-chevron-right')).toBeVisible()
    expect(screen.getByRole('icon-chevron-right')).toHaveAttribute('fill', '#FFFFFF')
  })

  it('should trigger prop "onClick" function when clicked', () => {
    const onClick = jest.fn()
    render(<IconButton type='chevron-right' onClick={onClick}/>)

    fireEvent.click(screen.getByRole('button-chevron-right'))
    expect(onClick).toHaveBeenCalled()
  })
})
