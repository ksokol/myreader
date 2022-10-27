import {useContext} from 'react'
import {act, fireEvent, render, screen} from '@testing-library/react'
import {NavigationProvider} from './NavigationProvider'
import {api} from '../../api'
import {SUBSCRIPTION_ENTRIES} from '../../constants'
import NavigationContext from './NavigationContext'

function TestComponent() {
  const {subscriptions, fetchData} = useContext(NavigationContext)

  return (
    <>
      <div role='fetch' onClick={fetchData}/>
      <div role='subscriptions'>{JSON.stringify(subscriptions)}</div>
    </>
  )
}

const expectedError = 'expected error'
const expectedInitialSubscriptions = '[{"uuid":"1","unseen":3},{"uuid":"2","unseen":2}]'

describe('navigation context', () => {

  let props

  const renderComponent = () => {
    return render(
      <NavigationProvider {...props}>
        <TestComponent/>
      </NavigationProvider>
    )
  }

  beforeEach(() => {
    fetch.jsonResponse({
      subscriptions: [
        {uuid: '1', unseen: 3},
        {uuid: '2', unseen: 2}
      ]
    })
  })

  it('should render children', async () => {
    renderComponent()

    expect(screen.getByRole('subscriptions')).toHaveTextContent('[]')
  })

  it('should contain expected context values in child component if fetch call succeeded', async () => {
    renderComponent()
    await act(async () => fireEvent.click(screen.getByRole('fetch')))

    expect(screen.getByRole('subscriptions')).toHaveTextContent(expectedInitialSubscriptions)
  })

  it('should replace subscriptions if fetch called again', async () => {
    renderComponent()

    await act(async () => fireEvent.click(screen.getByRole('fetch')))
    fetch.jsonResponse({
      subscriptions: [
        {uuid: '3', unseen: 4}
      ],
    })

    await act(async () => fireEvent.click(screen.getByRole('fetch')))

    expect(screen.getByRole('subscriptions')).toHaveTextContent('[{"uuid":"3","unseen":4}]')
  })

  it('should contain empty context value in child component fetch succeeded', async () => {
    fetch.rejectResponse({data: expectedError})

    renderComponent()
    await act(async () => fireEvent.click(screen.getByRole('fetch')))

    expect(screen.getByRole('subscriptions')).toHaveTextContent('[]')
  })

  it('should contain expected context values in child component if fetch failed', async () => {
    renderComponent()

    await act(async () => fireEvent.click(screen.getByRole('fetch')))
    fetch.rejectResponse({data: expectedError})
    await act(async () => fireEvent.click(screen.getByRole('fetch')))

    expect(screen.getByRole('subscriptions')).toHaveTextContent(expectedInitialSubscriptions)
  })

  it('should decrease subscription unseen count', async () => {
    renderComponent()
    await act(async () => fireEvent.click(screen.getByRole('fetch')))

    fetch.jsonResponse({
      uuid: '1',
      feedUuid: '1',
      seen: true
    })

    await act(async () => {
      return await api.request({
        method: 'PATCH',
        url: `${SUBSCRIPTION_ENTRIES}/10`,
        body: {seen: true},
        context: {
          oldValue: {
            uuid: '10',
            feedUuid: '1',
            seen: false
          }
        }
      })
    })

    expect(screen.getByRole('subscriptions')).toHaveTextContent('[{"uuid":"1","unseen":2},{"uuid":"2","unseen":2}]')
  })

  it('should increase subscription unseen count', async () => {
    renderComponent()
    await act(async () => fireEvent.click(screen.getByRole('fetch')))

    fetch.jsonResponse({
      uuid: '1',
      feedUuid: '1',
      seen: false
    })

    await act(async () => {
      return await api.request({
        method: 'PATCH',
        url: `${SUBSCRIPTION_ENTRIES}/10`,
        body: {seen: true},
        context: {
          oldValue: {
            uuid: '10',
            feedUuid: '1',
            seen: true
          }
        }
      })
    })

    expect(screen.getByRole('subscriptions')).toHaveTextContent('[{"uuid":"1","unseen":4},{"uuid":"2","unseen":2}]')
  })

  it('should do nothing if seen flag does not changed', async () => {
    renderComponent()
    await act(async () => fireEvent.click(screen.getByRole('fetch')))

    fetch.jsonResponse({
      uuid: '2',
      feedUuid: '1',
      seen: false
    })

    await act(async () => {
      return await api.request({
        method: 'PATCH',
        url: `${SUBSCRIPTION_ENTRIES}/10`,
        body: {seen: true},
        context: {
          oldValue: {
            uuid: '10',
            feedUuid: '2',
            seen: false
          }
        }
      })
    })

    expect(screen.getByRole('subscriptions')).toHaveTextContent(expectedInitialSubscriptions)
  })

  it('should do nothing if subscription is not available', async () => {
    renderComponent()
    await act(async () => fireEvent.click(screen.getByRole('fetch')))

    fetch.jsonResponse({
      uuid: '1',
      feedUuid: '10',
      seen: false
    })

    await act(async () => {
      return await api.request({
        method: 'PATCH',
        url: `${SUBSCRIPTION_ENTRIES}/10`,
        body: {seen: true},
        context: {
          oldValue: {
            uuid: '10',
            feedUuid: '10',
            seen: false
          }
        }
      })
    })

    expect(screen.getByRole('subscriptions')).toHaveTextContent(expectedInitialSubscriptions)
  })
})
