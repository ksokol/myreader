import {render, screen, fireEvent, act, waitFor} from '@testing-library/react'
import {LoginPage} from './LoginPage'
import {SecurityProvider} from '../../contexts/security/SecurityProvider'
import {RouterProvider} from '../../contexts/router'

const expectedPassword = 'expected password'

const renderComponent = async () => {
  await act(async () =>
    await render(
      <RouterProvider>
        <SecurityProvider>
          <LoginPage />
        </SecurityProvider>
      </RouterProvider>
    )
  )
}

describe('LoginPage', () => {

  beforeEach(() => {
    history.pushState(null, null, '#!/app/login')
  })

  it('should call authentication endpoint with given password', async () => {
    await renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {target: {value: expectedPassword}})
    await act(async () => fireEvent.click(screen.getByText('Login')))

    expect(fetch.mostRecent()).toMatchRequest({
      method: 'POST',
      url: 'check',
      body: 'password=expected+password',
    })
    expect(fetch.mostRecent().headers).toEqual(new Headers({
      'content-type': 'application/x-www-form-urlencoded',
      'x-requested-with': 'XMLHttpRequest'
    })
    )
  })

  it('should redirect if successfully authenticated', async () => {
    const currentHistoryLength = history.length
    await renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {target: {value: expectedPassword}})
    await act(async () => fireEvent.click(screen.getByText('Login')))

    await waitFor(() => {
      expect(history.length).toEqual(currentHistoryLength) // replace
      expect(document.location.href).toMatch(/\/app\/entries$/)
    })
  })

  it('should redirect if user is already authorized', async () => {
    const currentHistoryLength = history.length
    localStorage.setItem('myreader-security', '{"authorized": true}')
    await renderComponent()

    await waitFor(() => {
      expect(history.length).toEqual(currentHistoryLength) // replace
      expect(document.location.href).toMatch(/\/app\/entries$/)
    })
  })

  it('should disabled password input and login button if authentication request is still pending', async () => {
    fetch.responsePending()
    await renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {target: {value: expectedPassword}})
    await act(async () => fireEvent.click(screen.getByText('Login')))

    expect(screen.getByLabelText('Password')).toBeDisabled()
    expect(screen.getByText('Login')).toBeDisabled()
  })

  it('should show error message if password is wrong', async () => {
    fetch.rejectResponse()
    await renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {target: {value: expectedPassword}})
    await act(async () => fireEvent.click(screen.getByText('Login')))

    expect(screen.getByText('password wrong')).toBeInTheDocument()
  })

  it('should enable password input and login button if authentication request failed', async () => {
    fetch.rejectResponse()
    await renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {target: {value: expectedPassword}})
    await act(async () => fireEvent.click(screen.getByText('Login')))

    expect(screen.getByLabelText('Password')).toBeEnabled()
    expect(screen.getByText('Login')).toBeEnabled()
  })

  it('should show version and commit id', async () => {
    document.head.dataset.buildVersion = 'expected version'
    document.head.dataset.buildCommitId = 'expected commit id'

    await renderComponent()

    expect(screen.getByText('expected version')).toBeInTheDocument()
    expect(screen.getByText('expected commit id')).toBeInTheDocument()
  })
})
