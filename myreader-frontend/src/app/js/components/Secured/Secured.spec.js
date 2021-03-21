import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {render, screen} from '@testing-library/react'
import {Secured} from './Secured'
import {SecurityProvider} from '../../contexts/security/SecurityProvider'

jest.unmock('react-router')
jest.unmock('react-router-dom')

function TestComponent() {
  return Secured(() => 'expected text')
}

describe('Secured', () => {

  let history

  const renderComponent = () => {
    render(
      <Router history={history}>
        <SecurityProvider>
          <TestComponent />
        </SecurityProvider>
      </Router>
    )
  }

  beforeEach(() => {
    history = createMemoryHistory()
    localStorage.setItem('myreader-security', '{"authorized":true}')
  })

  it('should render component if authorized', () => {
    renderComponent()

    expect(screen.getByText('expected text')).toBeInTheDocument()
  })

  it('should redirect if unauthorized', () => {
    localStorage.setItem('myreader-security', '{"authorized":false}')
    renderComponent()

    expect(history.action).toEqual('REPLACE')
    expect(history.location.pathname).toEqual('/app/login')
  })
})
