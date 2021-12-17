import {act, render, screen} from '@testing-library/react'
import {Secured} from './Secured'
import {SecurityProvider} from '../../contexts/security/SecurityProvider'
import {RouterProvider} from '../../contexts/router'

function TestComponent() {
  return <Secured>expected text</Secured>
}

const renderComponent = async () => {
  await act(async () =>
    await render(
      <RouterProvider>
        <SecurityProvider>
          <TestComponent />
        </SecurityProvider>
      </RouterProvider>
    )
  )
}

describe('Secured', () => {

  beforeEach(() => {
    history.pushState(null, null, '#!/app/irrelevant')
    localStorage.setItem('myreader-security', '{"authorized":true}')
  })

  it('should render component if authorized', async () => {
    await renderComponent()

    expect(screen.getByText('expected text')).toBeInTheDocument()
  })

  it('should redirect if unauthorized', async () => {
    const currentHistoryLength = history.length
    localStorage.setItem('myreader-security', '{"authorized":false}')
    await renderComponent()

    expect(history.length).toEqual(currentHistoryLength) // replace
    expect(document.location.href).toMatch(/\/app\/login$/)
  })
})
