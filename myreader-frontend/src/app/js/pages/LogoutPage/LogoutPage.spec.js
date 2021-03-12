import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {act, render, screen} from '@testing-library/react'
import {LogoutPage} from './LogoutPage'
import {SecurityProvider} from '../../contexts/security/SecurityProvider'

jest.unmock('react-router')
jest.unmock('react-router-dom')

describe('LogoutPage', () => {

  let history

  const renderComponent = async () => {
    await act(async () => {
      await render(
        <Router history={history}>
          <SecurityProvider>
            <LogoutPage />
          </SecurityProvider>
        </Router>
      )
    })
  }

  beforeEach(() => {
    history = createMemoryHistory()
    localStorage.setItem('myreader-security', '{"authorized":true}')
  })

  it('should not redirect to login page if logout is still pending', async () => {
    fetch.responsePending()
    await renderComponent()

    expect(history.action).not.toEqual('REPLACE')
    expect(history.location.pathname).toEqual('/')
  })

  it('should redirect to login page if logout succeeded', async () => {
    await renderComponent()

    expect(history.action).toEqual('REPLACE')
    expect(history.location.pathname).toEqual('/app/login')
  })

  it('should set authorized state to false if logout succeeded', async () => {
    localStorage.setItem('myreader-security', '{"authorized":true}')

    await renderComponent()

    expect(localStorage.getItem('myreader-security')).toEqual('{"authorized":false}')
  })

  it('should not set authorized state to false if logout failed', async () => {
    fetch.rejectResponse('some error')
    await renderComponent()

    expect(localStorage.getItem('myreader-security')).toEqual('{"authorized":true}')
  })

  it('should show message if logout failed', async () => {
    fetch.rejectResponse('some error')
    await renderComponent()

    expect(screen.getByRole('dialog-error-message')).toHaveTextContent('Logout failed')
  })

  it('should go back to previous page if logout failed', async () => {
    fetch.rejectResponse('some error')
    await renderComponent()

    expect(history.action).toEqual('POP')
    expect(history.location.pathname).toEqual('/')
  })
})
