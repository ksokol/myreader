import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import {App} from './App'

const storageSecurityKey = 'myreader-security'
const storageSecurityValue = '{"passwordHash": "bogus"}'

const entry = Object.freeze({
  uuid: '1',
  title: 'expected title',
  feedTitle: 'expected feedTitle',
  origin: 'expected origin',
  seen: false,
  createdAt: '2021-02-27T06:48:05.087+01:00',
  content: 'expected entry content'
})

const navigationFragmentResponse = {
  subscriptions: [
    {title: 'subscription 1', uuid: '1', tag: 'group 1', unseen: 2},
  ],
}

const renderComponent = async () => {
  await act(async () =>
    await render(
      <App />
    )
  )
}

describe('App', () => {

  it('should redirect to login page when not logged in', async () => {
    await renderComponent()

    await waitFor(() => {
      expect(screen.getByLabelText('Password')).toBeVisible()
      expect(screen.getByText('Login')).toBeVisible()
    })
  })

  it('should redirect to entries page when logged in', async () => {
    localStorage.setItem(storageSecurityKey, storageSecurityValue)
    fetch.jsonResponseOnce(navigationFragmentResponse)
    fetch.jsonResponseOnce({content: [entry]})
    await renderComponent()

    await waitFor(() => {
      expect(screen.getByText('expected title')).toBeVisible()
      expect(screen.getByText('expected entry content')).toBeVisible()
      expect(screen.getByText('all')).toBeVisible()
      expect(screen.getByText('group 1')).toBeVisible()
    })
  })

  it('should redirect to login page when logged out', async () => {
    localStorage.setItem(storageSecurityKey, storageSecurityValue)
    fetch.jsonResponseOnce(navigationFragmentResponse)
    fetch.jsonResponseOnce({content: [entry]})
    await renderComponent()

    await act(async () => fireEvent.click(screen.getByText('Logout')))

    await waitFor(() => {
      expect(screen.getByLabelText('Password')).toBeVisible()
      expect(screen.getByText('Login')).toBeVisible()
    })
  })

  it('should redirect to entries page when app path not matched', async () => {
    localStorage.setItem(storageSecurityKey, storageSecurityValue)
    fetch.jsonResponseOnce(navigationFragmentResponse)
    fetch.jsonResponseOnce({content: [entry]})
    await renderComponent()
    fetch.jsonResponseOnce(navigationFragmentResponse)
    fetch.jsonResponseOnce({content: [entry]})

    act(() => {
      history.pushState(null, null, '#!/unknown')
      window.dispatchEvent(new Event('popstate'))
    })

    await waitFor(() => {
      expect(screen.getByText('expected title')).toBeVisible()
      expect(screen.getByText('expected entry content')).toBeVisible()
      expect(screen.getByText('all')).toBeVisible()
      expect(screen.getByText('group 1')).toBeVisible()
    })
  })

  it('should redirect to entries page when child path not matched', async () => {
    localStorage.setItem(storageSecurityKey, storageSecurityValue)
    fetch.jsonResponseOnce(navigationFragmentResponse)
    fetch.jsonResponseOnce({content: [entry]})
    await renderComponent()
    fetch.jsonResponseOnce(navigationFragmentResponse)
    fetch.jsonResponseOnce({content: [entry]})

    act(() => {
      history.pushState(null, null, '#!/app/unknown')
      window.dispatchEvent(new Event('popstate'))
    })

    await waitFor(() => {
      expect(screen.getByText('expected title')).toBeVisible()
      expect(screen.getByText('expected entry content')).toBeVisible()
      expect(screen.getByText('group 1')).toBeVisible()
    })
  })

  it('should render stream page with filter', async () => {
    localStorage.setItem(storageSecurityKey, storageSecurityValue)
    fetch.jsonResponseOnce(navigationFragmentResponse)
    fetch.jsonResponseOnce({content: [entry]})
    await renderComponent()
    fetch.jsonResponseOnce({content: [{
      ...entry,
      title: 'expected filtered title',
      content: 'expected filtered entry content'
    }]})

    await act(async () => fireEvent.click(screen.getByText('group 1')))

    await waitFor(() => {
      expect(screen.getByText('expected filtered title')).toBeVisible()
      expect(screen.getByText('expected filtered entry content')).toBeVisible()
    })
  })

  it('should render subscription list page and subscription page', async () => {
    localStorage.setItem(storageSecurityKey, storageSecurityValue)
    fetch.jsonResponseOnce(navigationFragmentResponse)
    fetch.jsonResponseOnce({content: [entry]})
    await renderComponent()

    await act(async () => fireEvent.click(screen.getByText('Subscriptions')))
    await act(async () => window.dispatchEvent(new Event('popstate')))

    await waitFor(() => {
      expect(screen.getByText('subscription 1')).toBeVisible()
      expect(screen.getByText('sometime')).toBeVisible()
    })

    fetch.jsonResponseOnce({
      subscription: {
        uuid: '1',
        title: 'expected title',
        origin: 'expected origin',
        tag: null,
        color: null,
      },
      tags: [],
      exclusionPatterns: [],
      fetchErrors: []
    })

    await act(async () => fireEvent.click(screen.getByText('subscription 1')))
    await act(async () => window.dispatchEvent(new Event('popstate')))

    await waitFor(() => {
      expect(screen.queryByDisplayValue('expected title')).toBeVisible()
      expect(screen.queryByDisplayValue('expected origin')).toBeVisible()
      expect(screen.getByText('Save')).toBeVisible()
      expect(screen.getByText('Delete')).toBeVisible()
    })
  })
})
