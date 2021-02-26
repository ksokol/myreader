import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {act, fireEvent, render, screen} from '@testing-library/react'
import {Navigation} from './Navigation'
import {SubscriptionProvider} from '../../contexts/subscription/SubscriptionProvider'
import {SettingsProvider} from '../../contexts/settings/SettingsProvider'

jest.unmock('react-router')
jest.unmock('react-router-dom')

describe('Navigation', () => {

  let props, history

  const renderComponent = async () => {
    return await act(async () => {
      return await render(
        <Router history={history}>
          <SettingsProvider>
            <SubscriptionProvider>
              <Navigation {...props} />
            </SubscriptionProvider>
          </SettingsProvider>
        </Router>
      )
    })
  }

  beforeEach(() => {
    history = createMemoryHistory()

    localStorage.setItem('myreader-settings', '{"showUnseenEntries": false}')

    props = {
      onClick: jest.fn()
    }

    fetch.jsonResponse({
      content: [
        {title: 'subscription 1', uuid: '1', tag: 'group 1', unseen: 2},
        {title: 'subscription 2', uuid: '2', tag: 'group 2', unseen: 0},
        {title: 'subscription 3', uuid: '3', tag: null, unseen: 0}
      ]
    })
  })

  it('should render navigation labels', async () => {
    await renderComponent()

    expect(screen.getByText('all')).toBeInTheDocument()
    expect(screen.getByText('group 1')).toBeInTheDocument()
    expect(screen.getByText('group 2')).toBeInTheDocument()
    expect(screen.getByText('subscription 3')).toBeInTheDocument()
    expect(screen.getByText('Subscriptions')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Add subscription')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('should navigate to route if clicked on navigation item', async () => {
    await renderComponent()

    fireEvent.click(screen.getByText('all'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/entries')
    expect(history.location.search).toEqual('')

    fireEvent.click(screen.getByText('group 1'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/entries')
    expect(history.location.search).toEqual('?feedTagEqual=group 1')

    fireEvent.click(screen.getByText('group 2'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/entries')
    expect(history.location.search).toEqual('?feedTagEqual=group 2')

    fireEvent.click(screen.getByText('subscription 3'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/entries')
    expect(history.location.search).toEqual('?feedUuidEqual=3')

    fireEvent.click(screen.getByText('Subscriptions'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/subscriptions')
    expect(history.location.search).toEqual('')

    fireEvent.click(screen.getByText('Settings'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/settings')
    expect(history.location.search).toEqual('')
    fireEvent.click(screen.getByText('Add subscription'))

    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/addSubscription')
    expect(history.location.search).toEqual('')
    fireEvent.click(screen.getByText('Logout'))

    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/logout')
    expect(history.location.search).toEqual('')

    expect(props.onClick).toHaveBeenCalledTimes(8)
  })

  it('should render navigation items with subscriptions.unseen > 0', async () => {
    localStorage.setItem('myreader-settings', '{"showUnseenEntries": true}')

    await renderComponent()

    expect(screen.getByText('all')).toBeInTheDocument()
    expect(screen.getByText('group 1')).toBeInTheDocument()
    expect(screen.queryByText('group 2')).not.toBeInTheDocument()
    expect(screen.queryByText('subscription 3')).not.toBeInTheDocument()
    expect(screen.getByText('Subscriptions')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Add subscription')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })
})
