import React from 'react'
import {render, fireEvent, screen, act} from '@testing-library/react'
import {Router, Route, Switch} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import FeedEditPage from './FeedEditPage'
import {LocationStateProvider} from '../../contexts/locationState/LocationStateProvider'

jest.unmock('react-router')
jest.unmock('react-router-dom')

describe('FeedEditPage', () => {

  let history

  const renderComponent = async () => {
    await act(async () => {
      render(
        <Router history={history}>
          <LocationStateProvider>
            <Switch>
              <Route path='/:uuid' component={FeedEditPage} />
            </Switch>
          </LocationStateProvider>
        </Router>
      )
    })
  }

  beforeEach(() => {
    history = createMemoryHistory()
    history.push({pathname: '1'})
  })

  it('should not render feed edit form if feed is still loading', async () => {
    fetch.responsePending()
    await renderComponent()

    expect(screen.queryByRole('input')).not.toBeInTheDocument()
    expect(screen.queryByText('Save')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    expect(screen.queryByRole('validations')).not.toBeInTheDocument()
  })

  it('should fetch feed for given uuid', async () => {
    fetch.responsePending()
    await renderComponent()

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/feeds/1'
    })
  })

  it('should render feed edit form', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    expect(screen.queryByDisplayValue('expected title')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('http:/example.com')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeEnabled()
    expect(screen.getByText('Delete')).toBeEnabled()
    expect(screen.queryByRole('validations')).not.toBeInTheDocument()
  })

  it('should save feed', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()
    fireEvent.click(screen.getByText('Save'))

    expect(fetch.mostRecent()).toMatchPatchRequest({
      url: 'api/2/feeds/1',
      body: {
        uuid: '1',
        title: 'expected title',
        url: 'http:/example.com',
        links: {},
      },
    })
  })

  it('should disable save and delete buttons if feed is still saving', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    fetch.responsePending()
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.getByText('Save')).toBeDisabled()
    expect(screen.getByText('Delete')).toBeDisabled()
  })

  it('should enable save and delete buttons if feed is saved', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.getByText('Save')).toBeEnabled()
    expect(screen.getByText('Delete')).toBeEnabled()
  })

  it('should show message if feed is saved', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole('dialog-info-message')).toHaveTextContent('Feed saved')
  })

  it('should show validation message', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    fetch.rejectResponse({status: 400, data: {errors: [{field: 'title', defaultMessage: 'expected error'}]}})
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole('validations')).toHaveTextContent('expected error')
  })

  it('should remove validation message if feed should be saved again', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    fetch.rejectResponse({status: 400, data: {errors: [{field: 'title', defaultMessage: 'expected error'}]}})
    await act(async () => fireEvent.click(screen.getByText('Save')))
    fetch.responsePending()
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole('validations')).not.toBeInTheDocument()
  })

  it('should show message when saving failed with an error', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()
    fetch.rejectResponse({status: 500, data: 'expected error'})
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole('validations')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog-error-message')).toHaveTextContent('expected error')
  })

  it('should remove feed', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    fireEvent.click(screen.getByText('Delete'))
    fireEvent.click(screen.getByText('Yes'))

    expect(fetch.mostRecent()).toMatchDeleteRequest({
      url: 'api/2/feeds/1'
    })
  })

  it('should disable save and delete buttons if feed is still removing', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    fireEvent.click(screen.getByText('Delete'))
    fireEvent.click(screen.getByText('Yes'))

    expect(screen.getByText('Save')).toBeDisabled()
    expect(screen.getByText('Delete')).toBeDisabled()
  })

  it('should enable save and delete buttons if feed could not be removed', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    fetch.rejectResponse({status: 500})
    fireEvent.click(screen.getByText('Delete'))
    await act(async () => fireEvent.click(screen.getByText('Yes')))

    expect(screen.getByText('Save')).toBeEnabled()
    expect(screen.getByText('Delete')).toBeEnabled()
  })

  it('should redirect to feed list page if feed has been removed', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    fetch.jsonResponseOnce({status: 204})
    fireEvent.click(screen.getByText('Delete'))
    await act(async () => fireEvent.click(screen.getByText('Yes')))

    expect(history.action).toEqual('REPLACE')
    expect(history.location.pathname).toEqual('/app/feed')
  })

  it('should show message if feed could not be removed with an HTTP 409 error', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    fetch.rejectResponse({status: 409})
    fireEvent.click(screen.getByText('Delete'))
    await act(async () => fireEvent.click(screen.getByText('Yes')))

    expect(screen.queryByRole('dialog-error-message')).toHaveTextContent('Can not delete. Feed has subscriptions')
  })

  it('should show message if feed could not be removed with an HTTP !== 409 error', async () => {
    fetch.jsonResponseOnce({uuid: '1', title: 'expected title', url: 'http:/example.com'})
    await renderComponent()

    fetch.rejectResponse({status: 400, data: 'expected error'})
    fireEvent.click(screen.getByText('Delete'))
    await act(async () => fireEvent.click(screen.getByText('Yes')))

    expect(screen.queryByRole('dialog-error-message')).toHaveTextContent('expected error')
  })
})
