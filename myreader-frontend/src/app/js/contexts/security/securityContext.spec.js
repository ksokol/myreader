import {render, screen, act} from '@testing-library/react'
import {SecurityProvider} from './SecurityProvider'
import {api} from '../../api'
import {useSecurity} from '.'

function TestComponent() {
  return (
    <div role='security'>
      {JSON.stringify(useSecurity())}
    </div>
  )
}

describe('security context', () => {

  const renderComponent = () => {
    render(
      <SecurityProvider>
        <TestComponent />
      </SecurityProvider>
    )
  }

  beforeEach(() => {
    localStorage.setItem('myreader-security', '{"authorized": true}')
  })

  it('should set prop "authorized" to false if status is 401', async () => {
    renderComponent()

    fetch.rejectResponse({status: 401})
    await act(() => api.get('irrelevant').catch(() => {/*ignore it */}))

    expect(screen.getByRole('security')).toHaveTextContent(JSON.stringify({
      authorized: false,
    }))
  })

  it('should not change props when status is 200', async () => {
    renderComponent()

    fetch.mockResponseOnce({status: 200})
    await api.get('irrelevant')

    expect(screen.getByRole('security')).toHaveTextContent(JSON.stringify({
      authorized: true,
    }))
  })
})
