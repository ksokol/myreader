import {act, render, screen, fireEvent} from '@testing-library/react'
import {SecurityProvider} from '../../../contexts/security/SecurityProvider'
import {LogoutNavigationItem} from './LogoutNavigationItem'
import {RouterProvider} from '../../../contexts/router'

const storageSecurityKey = 'myreader-security'
const storageSecurityValue = '{"authorized":true}'
const someError = 'some error'
const roleDialogErrorMessage = 'dialog-error-message'

const renderComponent = () => {
  return render(
    <RouterProvider>
      <SecurityProvider>
        <LogoutNavigationItem/>
      </SecurityProvider>
    </RouterProvider>
  )
}

describe('LogoutNavigationItem', () => {

  beforeEach(() => {
    history.pushState(null, null, '#!/app/irrelevant')
    localStorage.setItem(storageSecurityKey, storageSecurityValue)
  })

  it('should not redirect to login page if logout is still pending', async () => {
    const currentHistoryLength = history.length
    fetch.responsePending()
    renderComponent()
    await act(() => fireEvent.click(screen.getByText('Logout')))

    expect(history.length).toEqual(currentHistoryLength) // replace
    expect(document.location.href).toMatch(/\/app\/irrelevant$/)
  })

  it('should redirect to login page if logout succeeded', async () => {
    const currentHistoryLength = history.length
    renderComponent()
    await act(() => fireEvent.click(screen.getByText('Logout')))

    expect(history.length).toEqual(currentHistoryLength) // replace
    expect(document.location.href).toMatch(/\/app\/login$/)
  })

  it('should set authorized state to false if logout succeeded', async () => {
    localStorage.setItem(storageSecurityKey, storageSecurityValue)
    renderComponent()
    await act(() => fireEvent.click(screen.getByText('Logout')))

    expect(localStorage.getItem(storageSecurityKey)).toEqual('{"authorized":false}')
  })

  it('should not set authorized state to false if logout failed', async () => {
    fetch.rejectResponse(someError)
    renderComponent()
    await act(() => fireEvent.click(screen.getByText('Logout')))

    expect(localStorage.getItem(storageSecurityKey)).toEqual(storageSecurityValue)
    fireEvent.click(screen.getByRole(roleDialogErrorMessage))
  })

  it('should show message if logout failed', async () => {
    fetch.rejectResponse(someError)
    renderComponent()
    await act(() => fireEvent.click(screen.getByText('Logout')))

    expect(screen.getByRole(roleDialogErrorMessage)).toHaveTextContent('Logout failed')
    fireEvent.click(screen.getByRole(roleDialogErrorMessage))
  })

  it('should go back to previous page if logout failed', async () => {
    const currentHistoryLength = history.length
    fetch.rejectResponse(someError)
    renderComponent()
    await act(() => fireEvent.click(screen.getByText('Logout')))

    expect(history.length).toEqual(currentHistoryLength) // pop
    expect(document.location.href).toMatch(/\/app\/irrelevant$/)
  })
})
