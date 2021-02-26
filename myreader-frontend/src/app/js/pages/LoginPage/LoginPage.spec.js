import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {render, screen, fireEvent} from '@testing-library/react'
import {act} from 'react-dom/test-utils'
import {LoginPage} from './LoginPage'
import {SecurityProvider} from '../../contexts/security/SecurityProvider'

jest.unmock('react-router')
jest.unmock('react-router-dom')

describe('LoginPage', () => {

  let history

  const renderComponent = () => {
    render(
      <Router history={history}>
        <SecurityProvider>
          <LoginPage />
        </SecurityProvider>
      </Router>
    )
  }

  beforeEach(() => {
    history = createMemoryHistory()
  })

  it('should call authentication endpoint with given password', async () => {
    renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'expected password'}})
    await act(async () => fireEvent.click(screen.getByText('Login')))

    expect(fetch.mostRecent()).toMatchPostRequest({
      url: 'check',
      body: 'password=expected+password',
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded',
        'x-requested-with': 'XMLHttpRequest'
      })
    })
  })

  it('should redirect if successfully authenticated', async () => {
    renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'expected password'}})
    await act(async () => fireEvent.click(screen.getByText('Login')))

    expect(history.action).toEqual('REPLACE')
    expect(history.location.pathname).toEqual('/app/entries')
  })

  it('should redirect if user is already authorized', async () => {
    localStorage.setItem('myreader-security', '{"authorized": true}')
    renderComponent()

    expect(history.action).toEqual('REPLACE')
    expect(history.location.pathname).toEqual('/app/entries')
  })

  it('should disabled password input and login button if authentication request is still pending', async () => {
    fetch.responsePending()
    renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'expected password'}})
    await act(async () => fireEvent.click(screen.getByText('Login')))

    expect(screen.getByLabelText('Password')).toBeDisabled()
    expect(screen.getByText('Login')).toBeDisabled()
  })

  it('should show error message if password is wrong', async () => {
    fetch.rejectResponse()
    renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'expected password'}})
    await act(async () => fireEvent.click(screen.getByText('Login')))

    expect(screen.getByText('password wrong')).toBeInTheDocument()
  })

  it('should enable password input and login button if authentication request failed', async () => {
    fetch.rejectResponse()
    renderComponent()

    fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'expected password'}})
    await act(async () => fireEvent.click(screen.getByText('Login')))

    expect(screen.getByLabelText('Password')).toBeEnabled()
    expect(screen.getByText('Login')).toBeEnabled()
  })

  it('should show version and commit id', () => {
    document.head.dataset.buildVersion = 'expected version'
    document.head.dataset.buildCommitId = 'expected commit id'

    renderComponent()

    expect(screen.getByText('expected version')).toBeInTheDocument()
    expect(screen.getByText('expected commit id')).toBeInTheDocument()
  })
})
