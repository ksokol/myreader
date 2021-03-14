import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {act, render, screen, fireEvent} from '@testing-library/react'
import {SecurityProvider} from '../../../contexts/security/SecurityProvider'
import {LogoutNavigationItem} from './LogoutNavigationItem'

jest.unmock('react-router')
jest.unmock('react-router-dom')

describe('LogoutNavigationItem', () => {

  let history

  const renderComponent = async () => {
    await act(async () => {
      await render(
        <Router history={history}>
          <SecurityProvider>
            <LogoutNavigationItem />
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
    await act(async() => await fireEvent.click(screen.getByText('Logout')))

    expect(history.action).not.toEqual('REPLACE')
    expect(history.location.pathname).toEqual('/')
  })

  it('should redirect to login page if logout succeeded', async () => {
    await renderComponent()
    await act(async() => await fireEvent.click(screen.getByText('Logout')))

    expect(history.action).toEqual('REPLACE')
    expect(history.location.pathname).toEqual('/app/login')
  })

  it('should set authorized state to false if logout succeeded', async () => {
    localStorage.setItem('myreader-security', '{"authorized":true}')

    await renderComponent()
    await act(async() => await fireEvent.click(screen.getByText('Logout')))

    expect(localStorage.getItem('myreader-security')).toEqual('{"authorized":false}')
  })

  it('should not set authorized state to false if logout failed', async () => {
    fetch.rejectResponse('some error')
    await renderComponent()
    await act(async() => await fireEvent.click(screen.getByText('Logout')))

    expect(localStorage.getItem('myreader-security')).toEqual('{"authorized":true}')
  })

  it('should show message if logout failed', async () => {
    fetch.rejectResponse('some error')
    await renderComponent()
    await act(async() => await fireEvent.click(screen.getByText('Logout')))

    expect(screen.getByRole('dialog-error-message')).toHaveTextContent('Logout failed')
  })

  it('should go back to previous page if logout failed', async () => {
    fetch.rejectResponse('some error')
    await renderComponent()
    await act(async() => await fireEvent.click(screen.getByText('Logout')))

    expect(history.action).toEqual('POP')
    expect(history.location.pathname).toEqual('/')
  })
})
