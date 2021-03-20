import React from 'react'
import {render, screen, fireEvent, act} from '@testing-library/react'
import {LoadingBar} from './LoadingBar'
import {api} from '../../api'

function TestComponent() {
  return (
    <button
      data-testid='fetch'
      onClick={() => {
        api.get('/test')
      }}
    />
  )
}

describe('LoadingBar', () => {

  const renderComponent = () => render(
    <>
      <TestComponent />
      <LoadingBar />
    </>
  )

  it('should not render loading bar if there are no active requests', () => {
    renderComponent()

    expect(screen.queryByRole('loading-indicator')).not.toBeInTheDocument()
  })

  it('should render loading bar if there are active requests', async () => {
    renderComponent()

    expect(screen.queryByRole('loading-indicator')).not.toBeInTheDocument()

    fetch.responsePending()
    fireEvent.click(screen.getByTestId('fetch'))

    expect(screen.queryByRole('loading-indicator')).toBeInTheDocument()
  })

  it('should not render loading bar if there are no active requests anymore', async () => {
    renderComponent()

    expect(screen.queryByRole('loading-indicator')).not.toBeInTheDocument()

    fetch.jsonResponse({})
    await act(async () => await fireEvent.click(screen.getByTestId('fetch')))

    expect(screen.queryByRole('loading-indicator')).not.toBeInTheDocument()
  })
})
