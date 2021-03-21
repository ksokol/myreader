import React, {useContext, useEffect} from 'react'
import {render, fireEvent, waitFor, screen, act} from '@testing-library/react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {SubscriptionListPage} from './SubscriptionListPage'
import {SubscriptionProvider} from '../../contexts/subscription/SubscriptionProvider'
import SubscriptionContext from '../../contexts/subscription/SubscriptionContext'

function TestComponent({children}) {
  const {fetchSubscriptions} = useContext(SubscriptionContext)

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  return children
}

describe('SubscriptionListPage', () => {

  let history

  const renderComponent = async () => {
    await act(async () => {
      render(
        <>
          <div id='portal-header' />
          <Router history={history}>
            <SubscriptionProvider>
              <TestComponent>
                <SubscriptionListPage />
              </TestComponent>
            </SubscriptionProvider>
          </Router>
        </>
      )
    })
  }

  beforeEach(() => {
    history = createMemoryHistory()

    fetch.jsonResponseOnce({
      content: [
        {uuid: '1', title: 'title1', createdAt: '2021-02-27T06:48:05.087+01:00', fetchErrorCount: 42},
        {uuid: '2', title: 'title2', createdAt: '2021-02-27T07:48:05.087+01:00', fetchErrorCount: 0},
      ]
    })
  })

  it('should present given subscriptions', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(1614453487714)
    await renderComponent()

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptions',
    })
    await waitFor(() => {
      expect(screen.queryByText('title1')).toBeInTheDocument()
      expect(screen.queryByText('13 hours ago')).toBeInTheDocument()
      expect(screen.queryByText('title2')).toBeInTheDocument()
      expect(screen.queryByText('12 hours ago')).toBeInTheDocument()
    })
  })

  it('should navigate to subscription', async () => {
    await renderComponent()

    await waitFor(() => fireEvent.click(screen.queryByText('title1')))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/subscriptions/1')

    await waitFor(() => fireEvent.click(screen.queryByText('title2')))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/subscriptions/2')
  })

  it('should filter subscriptions by title title1', async () => {
    await renderComponent()

    fireEvent.change(screen.getByRole('search'), {target: {value: 'title1'}})

    expect(screen.getByRole('search')).toHaveValue('title1')
    expect(history.location.search).toEqual('?q=title1')
    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()
  })

  it('should filter subscriptions by title title2', async () => {
    await renderComponent()

    fireEvent.change(screen.getByRole('search'), {target: {value: 'title2'}})

    expect(screen.getByRole('search')).toHaveValue('title2')
    expect(history.location.search).toEqual('?q=title2')
    expect(screen.queryByText('title1')).not.toBeInTheDocument()
    expect(screen.queryByText('title2')).toBeInTheDocument()
  })

  it('should filter subscriptions by title TITLE1', async () => {
    await renderComponent()

    fireEvent.change(screen.getByRole('search'), {target: {value: 'TITLE1'}})

    expect(screen.getByRole('search')).toHaveValue('TITLE1')
    expect(history.location.search).toEqual('?q=TITLE1')
    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()
  })

  it('should filter subscriptions by title titl', async () => {
    await renderComponent()

    fireEvent.change(screen.getByRole('search'), {target: {value: 'titl'}})

    expect(screen.getByRole('search')).toHaveValue('titl')
    expect(history.location.search).toEqual('?q=titl')
    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).toBeInTheDocument()
  })

  it('should filter subscriptions by title other', async () => {
    await renderComponent()

    fireEvent.change(screen.getByRole('search'), {target: {value: 'other'}})

    expect(screen.getByRole('search')).toHaveValue('other')
    expect(history.location.search).toEqual('?q=other')
    expect(screen.queryByText('title1')).not.toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()
  })

  it('should reload subscription when refresh icon button clicked', async () => {
    await renderComponent()

    fetch.jsonResponseOnce({
      content: [
        {uuid: '2', title: 'title2', createdAt: 'createdAt2'},
        {uuid: '3', title: 'title3', createdAt: 'createdAt3'},
      ],
    })

    await act(async () => fireEvent.click(screen.getByRole('refresh')))

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptions',
    })
    expect(screen.queryByText('title1')).not.toBeInTheDocument()
    expect(screen.queryByText('title2')).toBeInTheDocument()
    expect(screen.queryByText('title3')).toBeInTheDocument()
  })

  it('should show filtered subscriptions if search query is set', async () => {
    await act(async () => {
      history.push({
        search: 'q=title1'
      })
    })

    await renderComponent()

    expect(screen.getByRole('search')).toHaveValue('title1')
    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()
  })
})
