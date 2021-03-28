import {render, screen, fireEvent} from '@testing-library/react'
import {IconButton} from './IconButton'

describe('IconButton', () => {

  it('should contain expected props', () => {
    render(<IconButton className='expected-className' type='close' disabled={true} />)

    expect(screen.getByRole('close')).toHaveClass('my-icon-button expected-className')
    expect(screen.getByRole('close')).toHaveAttribute('type', 'button')
    expect(screen.getByRole('close')).toBeDisabled()
  })

  it('should pass expected props to Icon component', () => {
    render(<IconButton type='close' inverse={true} />)

    expect(screen.getByRole('close')).toBeVisible()
    expect(screen.getByRole('close').firstChild).toHaveStyle({'--color': '#FFFFFF'})
  })

  it('should trigger prop "onClick" function when clicked', () => {
    const onClick = jest.fn()
    render(<IconButton type='close' onClick={onClick}/>)

    fireEvent.click(screen.getByRole('close'))
    expect(onClick).toHaveBeenCalled()
  })
})
