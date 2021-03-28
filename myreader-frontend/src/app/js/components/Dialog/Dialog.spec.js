import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {Dialog} from './Dialog'

describe('Dialog', () => {

  let props

  beforeAll(() => {
    window.HTMLDialogElement = undefined
  })

  beforeEach(() => {
    props = {
      header: 'expected header',
      body: 'expected body',
      footer: 'expected footer',
      onClickClose: jest.fn()
    }
  })

  it('should render dialog header, body and footer', () => {
    render(<Dialog {...props} />)

    expect(screen.getByRole('dialog').querySelector('[class="my-dialog__header"]'))
      .toHaveTextContent('expected header')
    expect(screen.getByRole('dialog').querySelector('[class="my-dialog__body"]'))
      .toHaveTextContent('expected body')
    expect(screen.getByRole('dialog').querySelector('[class="my-dialog__footer"]'))
      .toHaveTextContent('expected footer')
  })

  it('should not render dialog header, body and footer when undefined', () => {
    props = {}
    render(<Dialog />)

    expect(screen.getByRole('dialog').querySelector('[class="my-dialog__header"]'))
      .not.toBeInTheDocument()
    expect(screen.getByRole('dialog').querySelector('[class="my-dialog__body"]'))
      .not.toBeInTheDocument()
    expect(screen.getByRole('dialog').querySelector('[class="my-dialog__footer"]'))
      .not.toBeInTheDocument()
  })

  it('should trigger prop function "onClickClose" when dialog close button clicked', async () => {
    render(<Dialog {...props} />)

    fireEvent.click(screen.getByRole('close-dialog'))

    await waitFor(() => expect(props.onClickClose).toHaveBeenCalled())
  })
})
