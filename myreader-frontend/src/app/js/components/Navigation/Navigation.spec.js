import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import {Navigation} from './Navigation'
import {NavigationProvider} from '../../contexts/navigation/NavigationProvider'
import {SettingsProvider} from '../../contexts/settings/SettingsProvider'
import {SecurityProvider} from '../../contexts/security/SecurityProvider'
import {RouterProvider} from '../../contexts/router'

const renderComponent = async (props) => {
  return await act(async () =>
    await render(
      <RouterProvider>
        <SecurityProvider>
          <SettingsProvider>
            <NavigationProvider>
              <Navigation {...props} />
            </NavigationProvider>
          </SettingsProvider>
        </SecurityProvider>
      </RouterProvider>
    )
  )
}

const byText = text => {
  const sibling = screen.getByText(text).nextElementSibling
  return sibling ? sibling.textContent : null
}

describe('Navigation', () => {

  let props

  beforeEach(() => {
    history.pushState(null, null, '#!/app/entries')

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
    })
  })

  it('should render navigation labels', async () => {
    await renderComponent(props)

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
    let currentHistoryLength = history.length
    await renderComponent(props)

    await act(async () => fireEvent.click(screen.getByText('all')))
    await waitFor(() => {
      expect(history.length).toEqual(currentHistoryLength) // push
      expect(document.location.href).toMatch(/\/app\/entries$/)
    })
    currentHistoryLength = history.length

    await act(async () => fireEvent.click(screen.getByText('group 1')))
    await waitFor(() => {
      expect(history.length).toBeGreaterThan(currentHistoryLength) // push
      expect(document.location.href).toMatch(/\/app\/entries\?feedTagEqual=group%201$/)
    })
    currentHistoryLength = history.length

    await act(async () => fireEvent.click(screen.getByText('group 2')))
    await waitFor(() => {
      expect(history.length).toBeGreaterThan(currentHistoryLength) // push
      expect(document.location.href).toMatch(/\/app\/entries\?feedTagEqual=group%202$/)
    })
    currentHistoryLength = history.length

    await act(async () => fireEvent.click(screen.getByText('subscription 3')))
    await waitFor(() => {
      expect(history.length).toBeGreaterThan(currentHistoryLength) // push
      expect(document.location.href).toMatch(/\/app\/entries\?feedUuidEqual=3$/)
    })
    currentHistoryLength = history.length

    await act(async () => fireEvent.click(screen.getByText('subscription 4')))
    await waitFor(() => {
      expect(history.length).toBeGreaterThan(currentHistoryLength) // push
      expect(document.location.href).toMatch(/\/app\/entries\?feedUuidEqual=4$/)
    })
    currentHistoryLength = history.length

    await act(async () => fireEvent.click(screen.getByText('Subscriptions')))
    await waitFor(() => {
      expect(history.length).toBeGreaterThan(currentHistoryLength) // push
      expect(document.location.href).toMatch(/\/app\/subscriptions$/)
    })
    currentHistoryLength = history.length

    fireEvent.click(screen.getByText('Settings'))
    fireEvent.click(screen.getByText('Add subscription'))
    await act(async () => fireEvent.click(screen.getByText('Logout')))

    expect(props.onClick).toHaveBeenCalledTimes(6)
  })

  it('should render navigation items with subscriptions.unseen > 0', async () => {
    localStorage.setItem('myreader-settings', '{"showUnseenEntries": true}')

    await renderComponent(props)

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
    await renderComponent(props)

    expect(byText('all')).toEqual('5')
    expect(byText('group 1')).toEqual('2')
    expect(byText('group 2')).toEqual('0')
    expect(byText('subscription 3')).toEqual('0')
    expect(byText('subscription 4')).toEqual('3')
  })
})
