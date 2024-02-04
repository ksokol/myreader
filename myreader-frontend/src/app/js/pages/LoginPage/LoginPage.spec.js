import {render, screen, fireEvent, act, waitFor} from '@testing-library/react'
import {LoginPage} from './LoginPage'
import {SecurityProvider} from '../../contexts/security/SecurityProvider'
import {RouterProvider} from '../../contexts/router'

const expectedPassword = 'expected password'

const renderComponent = async () => {
  await act(async () =>
    await render(
      <SecurityProvider>
        <RouterProvider>
          <LoginPage/>
        </RouterProvider>
      </SecurityProvider>
    )
  )
}

describe('LoginPage', () => {

  beforeEach(() => {
    history.pushState(null, null, '#!/app/login')
  })

  it('should call authentication endpoint with given password hash', async () => {
    fetch.jsonResponseOnce()

    await renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {target: {value: expectedPassword}})
    await act(async () => fireEvent.click(screen.getByText('Login')))

    expect(fetch.mostRecent().url).toEqual('api/2/subscriptionEntries?feedTagEqual=')
    expect(fetch.mostRecent().method).toEqual('GET')
    expect(fetch.mostRecent().headers).toEqual(new Headers({
        'content-type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        'authorization': `Bearer 0da7dc387915aff0fef81a05a8606b8ad5bf20324dcdd4c14603956342d5bcc950ffdbb782e97c87d182c9506b1eadb2918a3a1194730ce4e5024cffc888d43a`,
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
    localStorage.setItem('myreader-security', '{"passwordHash": "bogus"}')
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
})
