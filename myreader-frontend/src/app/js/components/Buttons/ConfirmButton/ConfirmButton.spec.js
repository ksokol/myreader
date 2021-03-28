import {render, screen, fireEvent} from '@testing-library/react'
import {ConfirmButton} from './ConfirmButton'

const expectButtonText = 'expect button text'

describe('ConfirmButton', () => {

  let props

  beforeEach(() => {
    props = {
      onClick: jest.fn()
    }
  })

  it('should pass expected props to call to action button', () => {
    render(<ConfirmButton {...props}>{expectButtonText}</ConfirmButton>)

    expect(screen.getByText(expectButtonText)).toBeVisible()
  })

  it('should disable call to action button when prop "disabled" is set to true', () => {
    props.disabled = true
    render(<ConfirmButton {...props}>{expectButtonText}</ConfirmButton>)

    expect(screen.getByText(expectButtonText)).toBeDisabled()
  })

  it('should pass additional prop to call to action button', () => {
    props.type = 'submit'
    render(<ConfirmButton {...props}>{expectButtonText}</ConfirmButton>)

    expect(screen.getByText(expectButtonText)).toHaveAttribute('type', 'submit')
  })

  it('should render confirm and reject button when call to action button clicked', () => {
    render(<ConfirmButton {...props}>{expectButtonText}</ConfirmButton>)
    fireEvent.click(screen.getByText(expectButtonText))

    expect(screen.getByText('Yes')).toBeVisible()
    expect(screen.getByText('No')).toBeVisible()
  })

  it('should disabled confirm and reject button when prop "disabled" is set to false', () => {
    const {rerender} = render(<ConfirmButton {...props}>{expectButtonText}</ConfirmButton>)
    fireEvent.click(screen.getByText(expectButtonText))
    props.disabled = true
    rerender(<ConfirmButton {...props}>expect button text</ConfirmButton>)

    expect(screen.getByText('Yes')).toBeDisabled()
    expect(screen.getByText('No')).toBeDisabled()
  })

  it('should render call to action button again when reject button clicked', () => {
    render(<ConfirmButton {...props}>{expectButtonText}</ConfirmButton>)
    fireEvent.click(screen.getByText(expectButtonText))
    fireEvent.click(screen.getByText('No'))

    expect(screen.getByText(expectButtonText)).toBeVisible()
  })

  it('should render call to action button again when confirm button clicked', () => {
    render(<ConfirmButton {...props}>{expectButtonText}</ConfirmButton>)
    fireEvent.click(screen.getByText(expectButtonText))
    fireEvent.click(screen.getByText('Yes'))

    expect(screen.getByText(expectButtonText)).toBeVisible()
  })

  it('should not trigger prop function "onClick" when reject button clicked', () => {
    render(<ConfirmButton {...props}>{expectButtonText}</ConfirmButton>)
    fireEvent.click(screen.getByText(expectButtonText))
    fireEvent.click(screen.getByText('No'))

    expect(props.onClick).not.toHaveBeenCalled()
  })

  it('should trigger prop function "onClick" when confirm button clicked', () => {
    render(<ConfirmButton {...props}>{expectButtonText}</ConfirmButton>)
    fireEvent.click(screen.getByText(expectButtonText))
    fireEvent.click(screen.getByText('Yes'))

    expect(props.onClick).toHaveBeenCalledWith()
  })
})
