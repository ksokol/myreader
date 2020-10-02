import React from 'react'
import {render, fireEvent, waitFor, screen, act} from '@testing-library/react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {SubscriptionListPage} from './SubscriptionListPage'
import {LocationStateProvider} from '../../contexts/locationState/LocationStateProvider'
import {SubscriptionProvider} from '../../contexts/subscription/SubscriptionProvider'

jest.unmock('react-router')
jest.unmock('react-router-dom')

describe('SubscriptionListPage', () => {

  let history

  const renderComponent = async () => {
    await act(async () => {
      render(
        <Router history={history}>
          <LocationStateProvider>
            <SubscriptionProvider>
              <SubscriptionListPage />
            </SubscriptionProvider>
          </LocationStateProvider>
        </Router>
      )
    })
  }

  beforeEach(() => {
    history = createMemoryHistory()

    fetch.jsonResponseOnce({
      content: [
        {uuid: '1', title: 'title1', createdAt: 'createdAt1'},
        {uuid: '2', title: 'title2', createdAt: 'createdAt2'},
      ]
    })
  })

  it('should present given subscriptions', async () => {
    await renderComponent()

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptions',
    })
    await waitFor(() => {
      expect(screen.queryByTitle('title1')).toBeInTheDocument()
      expect(screen.queryByTitle('title2')).toBeInTheDocument()
    })
  })

  it('should navigate to subscription', async () => {
    await renderComponent()

    await waitFor(() => fireEvent.click(screen.queryByTitle('title1')))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/subscriptions/1')

    await waitFor(() => fireEvent.click(screen.queryByTitle('title2')))
    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/subscriptions/2')
  })

  it('should filter subscriptions by title title1', async () => {
    await renderComponent()

    await act(async () => fireEvent.change(screen.getByRole('search'), {target: {value: 'title1'}}))

    await waitFor(() => {
      expect(screen.queryByTitle('title1')).toBeInTheDocument()
      expect(screen.queryByTitle('title2')).not.toBeInTheDocument()
    })
  })

  it('should filter subscriptions by title title2', async () => {
    await renderComponent()

    await act(async () => fireEvent.change(screen.getByRole('search'), {target: {value: 'title2'}}))

    await waitFor(() => {
      expect(screen.queryByTitle('title1')).not.toBeInTheDocument()
      expect(screen.queryByTitle('title2')).toBeInTheDocument()
    })
  })

  it('should filter subscriptions by title TITLE1', async () => {
    await renderComponent()

    await act(async () => fireEvent.change(screen.getByRole('search'), {target: {value: 'TITLE1'}}))

    await waitFor(() => {
      expect(screen.queryByTitle('title1')).toBeInTheDocument()
      expect(screen.queryByTitle('title2')).not.toBeInTheDocument()
    })
  })

  it('should filter subscriptions by title titl', async () => {
    await renderComponent()

    await act(async () => fireEvent.change(screen.getByRole('search'), {target: {value: 'titl'}}))

    // TODO Workaround for "Error: Ran 1000000 timers, and there are still more!" when running all tests
    await waitFor(() => expect(history.location.search).toEqual('?q=titl'))

    expect(screen.queryByTitle('title1')).toBeInTheDocument()
    expect(screen.queryByTitle('title2')).toBeInTheDocument()
  })

  it('should filter subscriptions by title other', async () => {
    await renderComponent()

    await act(async () => fireEvent.change(screen.getByRole('search'), {target: {value: 'other'}}))

    await waitFor(() => {
      expect(screen.queryByTitle('title1')).not.toBeInTheDocument()
      expect(screen.queryByTitle('title2')).not.toBeInTheDocument()
    })
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
    expect(screen.queryByTitle('title1')).not.toBeInTheDocument()
    expect(screen.queryByTitle('title2')).toBeInTheDocument()
    expect(screen.queryByTitle('title3')).toBeInTheDocument()
  })
})
