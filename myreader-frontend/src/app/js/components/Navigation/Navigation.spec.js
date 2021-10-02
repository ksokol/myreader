import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {act, fireEvent, render, screen} from '@testing-library/react'
import {Navigation} from './Navigation'
import {NavigationProvider} from '../../contexts/navigation/NavigationProvider'
import {SettingsProvider} from '../../contexts/settings/SettingsProvider'
import {SecurityProvider} from '../../contexts/security/SecurityProvider'

const appEntries = '/app/entries'
const selectedNavigationItemClass = 'selected-navigation-item'

describe('Navigation', () => {

  let props, history

  const renderComponent = async () => {
    return await act(async () => {
      return await render(
        <Router history={history}>
          <SecurityProvider>
            <SettingsProvider>
              <NavigationProvider>
                <Navigation {...props} />
              </NavigationProvider>
            </SettingsProvider>
          </SecurityProvider>
        </Router>
      )
    })
  }

  beforeEach(() => {
    history = createMemoryHistory()

    localStorage.setItem('myreader-settings', '{"showUnseenEntries": false}')
    localStorage.setItem('myreader-security', '{"authorized":true}')

    props = {
      onClick: jest.fn()
    }

    fetch.jsonResponse({
      subscriptions: [
        {title: 'subscription 1', uuid: '1', tag: 'group 1', unseen: 2},
        {title: 'subscription 2', uuid: '2', tag: 'group 2', unseen: 0},
        {title: 'subscription 3', uuid: '3', tag: null, unseen: 0},
        {title: 'subscription 4', uuid: '4', tag: null, unseen: 3}
      ],
      subscriptionEntryTags: ['tag1', 'tag2']
    })
  })

  it('should render navigation labels', async () => {
    await renderComponent()

    expect(screen.getByText('all')).toBeInTheDocument()
    expect(screen.getByText('group 1')).toBeInTheDocument()
    expect(screen.getByText('group 2')).toBeInTheDocument()
    expect(screen.getByText('subscription 3')).toBeInTheDocument()
    expect(screen.getByText('subscription 4')).toBeInTheDocument()
    expect(screen.getByText('Subscriptions')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Add subscription')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('should navigate to route if clicked on navigation item', async () => {
    await renderComponent()

    fireEvent.click(screen.getByText('all'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual(appEntries)
    expect(history.location.search).toEqual('')

    fireEvent.click(screen.getByText('group 1'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual(appEntries)
    expect(history.location.search).toEqual('?feedTagEqual=group 1')

    fireEvent.click(screen.getByText('group 2'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual(appEntries)
    expect(history.location.search).toEqual('?feedTagEqual=group 2')

    fireEvent.click(screen.getByText('subscription 3'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual(appEntries)
    expect(history.location.search).toEqual('?feedUuidEqual=3')

    fireEvent.click(screen.getByText('subscription 4'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual(appEntries)
    expect(history.location.search).toEqual('?feedUuidEqual=4')

    fireEvent.click(screen.getByText('Subscriptions'))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/subscriptions')
    expect(history.location.search).toEqual('')

    fireEvent.click(screen.getByText('Settings'))
    fireEvent.click(screen.getByText('Add subscription'))
    await act(async () => await fireEvent.click(screen.getByText('Logout')))

    expect(props.onClick).toHaveBeenCalledTimes(6)
  })

  it('should render navigation items with subscriptions.unseen > 0', async () => {
    localStorage.setItem('myreader-settings', '{"showUnseenEntries": true}')

    await renderComponent()

    expect(screen.getByText('all')).toBeInTheDocument()
    expect(screen.getByText('group 1')).toBeInTheDocument()
    expect(screen.queryByText('group 2')).not.toBeInTheDocument()
    expect(screen.queryByText('subscription 3')).not.toBeInTheDocument()
    expect(screen.queryByText('subscription 4')).toBeInTheDocument()
    expect(screen.getByText('Subscriptions')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Add subscription')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('should render badge', async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const byText = text => {
      const sibling = screen.getByText(text).nextElementSibling
      return sibling ? sibling.textContent : null
    }

    await renderComponent()

    expect(byText('all')).toEqual('5')
    expect(byText('group 1')).toEqual('2')
    expect(byText('group 2')).toEqual('0')
    expect(byText('subscription 3')).toEqual('0')
    expect(byText('subscription 4')).toEqual('3')
    expect(byText('Bookmarks')).toBeNull()
  })

  it('should render bookmark items', async () => {
    await renderComponent()

    fireEvent.click(screen.getByText('Bookmarks'))

    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
  })

  it('should hide bookmark items', async () => {
    await renderComponent()

    fireEvent.click(screen.getByText('Bookmarks'))
    fireEvent.click(screen.getByText('Bookmarks'))

    expect(screen.queryByText('tag1')).not.toBeInTheDocument()
    expect(screen.queryByText('tag2')).not.toBeInTheDocument()
  })

  it('should navigate to route if bookmark item clicked', async () => {
    await renderComponent()

    fireEvent.click(screen.getByText('Bookmarks'))
    fireEvent.click(screen.getByText('tag1'))

    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual(appEntries)
    expect(history.location.search).toEqual('?seenEqual=*&entryTagEqual=tag1')
    expect(props.onClick).toHaveBeenCalled()
  })

  it('should select bookmark item', async () => {
    history.push({
      search: '?entryTagEqual=tag1'
    })
    await renderComponent()

    fireEvent.click(screen.getByText('Bookmarks'))

    expect(screen.queryAllByRole(selectedNavigationItemClass)[0]).toHaveTextContent(/all/)
    expect(screen.queryAllByRole(selectedNavigationItemClass)[1]).toHaveTextContent('tag1')
  })

  it('should not select bookmark item', async () => {
    await renderComponent()

    fireEvent.click(screen.getByText('Bookmarks'))

    expect(screen.queryByRole(selectedNavigationItemClass)).toHaveTextContent(/all/)
  })
})
