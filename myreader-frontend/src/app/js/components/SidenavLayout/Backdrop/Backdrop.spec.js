import {act, fireEvent, render, screen} from '@testing-library/react'
import {Backdrop} from './Backdrop'

describe('Backdrop', () => {

  let props

  beforeEach(() => {
    jest.useFakeTimers()

    props = {
      maybeVisible: false,
      onClick: jest.fn()
    }
  })

  afterEach(() =>  {
    act(() => jest.runOnlyPendingTimers())
  })

  it('should not show backdrop when mounted', () => {
    render(<Backdrop {...props} />)

    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
  })

  it('should show backdrop when prop "maybeVisible" changes to true', () => {
    const {rerender} = render(<Backdrop {...props} />)
    props.maybeVisible = true
    rerender(<Backdrop {...props} />)

    expect(screen.queryByRole('backdrop')).toBeInTheDocument()
  })

  it('should not show backdrop instantly when prop "maybeVisible" changes from true to false', () => {
    props.maybeVisible = true
    const {rerender} = render(<Backdrop {...props} />)

    props.maybeVisible = false
    rerender(<Backdrop {...props} />)

    expect(screen.queryByRole('backdrop')).toBeInTheDocument()
  })

  it('should hide backdrop when 300ms passed', () => {
    props.maybeVisible = true
    const {rerender} = render(<Backdrop {...props} />)

    props.maybeVisible = false
    rerender(<Backdrop {...props} />)

    act(() => jest.advanceTimersByTime(299))
    expect(screen.queryByRole('backdrop')).toBeInTheDocument()

    act(() => jest.advanceTimersByTime(1))
    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
  })

  it('should not show backdrop when prop "maybeVisible" changes to true within 300ms', () => {
    props.maybeVisible = true
    const {rerender} = render(<Backdrop {...props} />)

    props.maybeVisible = false
    rerender(<Backdrop {...props} />)
    act(() => jest.advanceTimersByTime(299))

    props.maybeVisible = true
    rerender(<Backdrop {...props} />)
    act(() => jest.advanceTimersByTime(1))

    expect(screen.queryByRole('backdrop')).toBeInTheDocument()
  })

  it('should show backdrop when prop "maybeVisible" changes to true again', () => {
    props.maybeVisible = true
    const {rerender} = render(<Backdrop {...props} />)

    props.maybeVisible = false
    rerender(<Backdrop {...props} />)
    act(() => jest.advanceTimersByTime(300))

    props.maybeVisible = true
    rerender(<Backdrop {...props} />)

    expect(screen.queryByRole('backdrop')).toBeInTheDocument()
  })

  it('should append visible class when backdrop is visible', () => {
    props.maybeVisible = true
    render(<Backdrop {...props} />)

    expect(screen.queryByRole('backdrop')).toHaveClass('my-backdrop--visible')
  })

  it('should append visible closing when backdrop is about to be hidden', () => {
    props.maybeVisible = true
    const {rerender} = render(<Backdrop {...props} />)

    props.maybeVisible = false
    rerender(<Backdrop {...props} />)

    expect(screen.queryByRole('backdrop')).toHaveClass('my-backdrop--closing')
  })

  it('should trigger prop function "onClick" when click on backdrop occurred', () => {
    props.maybeVisible = true
    render(<Backdrop {...props} />)

    fireEvent.click(screen.queryByRole('backdrop'))

    expect(props.onClick).toHaveBeenCalled()
  })
})
