import {act, render, screen, fireEvent} from '@testing-library/react'
import {SecurityProvider} from '../../../contexts/security/SecurityProvider'
import {LogoutNavigationItem} from './LogoutNavigationItem'
import {RouterProvider} from '../../../contexts/router'

const storageSecurityKey = 'myreader-security'
const storageSecurityValue = '{"passwordHash":"bogus"}'

const renderComponent = () => {
  return render(
    <SecurityProvider>
      <RouterProvider>
        <LogoutNavigationItem/>
      </RouterProvider>
    </SecurityProvider>
  )
}

describe('LogoutNavigationItem', () => {

  beforeEach(() => {
    history.pushState(null, null, '#!/app/irrelevant')
    localStorage.setItem(storageSecurityKey, storageSecurityValue)
  })

  it('should redirect to login page if logout succeeded', async () => {
    const currentHistoryLength = history.length
    renderComponent()
    await act(() => fireEvent.click(screen.getByText('Logout')))

    expect(history.length).toEqual(currentHistoryLength) // replace
    expect(document.location.href).toMatch(/\/app\/login$/)
  })

  it('should remove passwordHash if logout succeeded', async () => {
    localStorage.setItem(storageSecurityKey, storageSecurityValue)
    renderComponent()
    await act(() => fireEvent.click(screen.getByText('Logout')))

    expect(localStorage.getItem(storageSecurityKey)).toEqual('{"passwordHash":null}')
  })
})
