import React from 'react'
import {render, fireEvent, screen, act} from '@testing-library/react'
import {Router, Route, Switch} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import SubscriptionEditPage from './SubscriptionEditPage'
import {LocationStateProvider} from '../../contexts/locationState/LocationStateProvider'

jest.unmock('react-router')
jest.unmock('react-router-dom')

const expectedError = 'expectedError'
const subscription = {
  uuid: '1',
  title: 'expected title',
  origin: 'http:/example.com',
  feedTag: {name: 'tag1'}
}
const subscriptionTags = {
  links: [],
  content: []
}
const exclusions = {
  content: []
}

describe('SubscriptionEditPage', () => {

  let history

  const renderComponent = async () => {
    await act(async () => {
      render(
        <Router history={history}>
          <LocationStateProvider>
            <Switch>
              <Route
                exact={true}
                path='/:uuid'
                component={SubscriptionEditPage}
              />
            </Switch>
          </LocationStateProvider>
        </Router>
      )
    })
  }

  beforeEach(() => {
    history = createMemoryHistory()
    history.push({pathname: '1'})

    fetch.jsonResponseOnce(subscription)
    fetch.jsonResponseOnce(subscriptionTags)
    fetch.jsonResponseOnce(exclusions)
  })

  it('should not render subscription edit form if subscription is still loading', async () => {
    fetch.resetMocks()
    fetch.responsePending()
    await renderComponent()

    expect(screen.queryByRole('input')).not.toBeInTheDocument()
    expect(screen.queryByText('Save')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    expect(screen.queryByRole('validations')).not.toBeInTheDocument()
  })

  it('should fetch subscription tags and subscription for given uuid', async () => {
    await renderComponent()

    expect(fetch.first()).toMatchGetRequest({
      url: 'api/2/subscriptions/1'
    })
    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/exclusions/1/pattern'
    })
  })

  it('should render subscription edit form', async () => {
    await renderComponent()

    expect(screen.queryByDisplayValue('expected title')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('http:/example.com')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('tag1')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeEnabled()
    expect(screen.getByText('Delete')).toBeEnabled()
    expect(screen.queryByRole('title-validation')).not.toBeInTheDocument()
  })

  it('should save subscription', async () => {
    await renderComponent()

    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(fetch.mostRecent()).toMatchPatchRequest({
      url: 'api/2/subscriptions/1',
      body: {
        uuid: '1',
        title: 'expected title',
        origin: 'http:/example.com',
        feedTag: {name: 'tag1'},
      },
    })
  })

  it('should disable save and delete buttons if subscription is still saving', async () => {
    await renderComponent()

    fetch.responsePending()
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.getByText('Save')).toBeDisabled()
    expect(screen.getByText('Delete')).toBeDisabled()
  })

  it('should enable save and delete buttons if subscription is saved', async () => {
    await renderComponent()

    fetch.jsonResponseOnce(subscription)
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.getByText('Save')).toBeEnabled()
    expect(screen.getByText('Delete')).toBeEnabled()
  })

  it('should show message if subscription is saved', async() => {
    await renderComponent()

    fetch.jsonResponseOnce(subscription)
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole('dialog-info-message')).toHaveTextContent('Subscription saved')
  })

  it('should reload if subscription has been saved', async() => {
    await renderComponent()

    fetch.jsonResponseOnce(subscription)
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/1')
  })

  it('should show validation message', async() => {
    await renderComponent()

    fetch.rejectResponse({status: 400, data: {errors: [{field: 'title', defaultMessage: expectedError}]}})
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole('title-validation')).toHaveTextContent(expectedError)
  })

  it('should remove validation message if subscription should be saved again', async () => {
    await renderComponent()

    fetch.jsonResponseOnce(subscription)
    await act(async () => fireEvent.click(screen.getByText('Save')))
    fetch.responsePending()
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole('title-validation')).not.toBeInTheDocument()
  })

  it('should show message when saving failed with an error', async() => {
    await renderComponent()

    fetch.rejectResponse({status: 500, data: expectedError})
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole('title-validation')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog-error-message')).toHaveTextContent(expectedError)
  })

  it('should remove subscription', async () => {
    await renderComponent()
    fetch.resetMocks()

    fetch.jsonResponseOnce({status: 204})
    await act(async () => fireEvent.click(screen.getByText('Delete')))
    await act(async () => fireEvent.click(screen.getByText('Yes')))

    expect(fetch.first()).toMatchDeleteRequest({
      url: 'api/2/subscriptions/1'
    })
  })

  it('should disable save and delete buttons if subscription is still removing', async () => {
    await renderComponent()

    fetch.responsePending()
    await act(async () => fireEvent.click(screen.getByText('Delete')))
    await act(async () => fireEvent.click(screen.getByText('Yes')))

    expect(screen.getByText('Save')).toBeDisabled()
    expect(screen.getByText('Delete')).toBeDisabled()
  })

  it('should enable save and delete buttons if subscription could not be removed', async () => {
    await renderComponent()

    fetch.rejectResponse({status: 500})
    await act(async () => fireEvent.click(screen.getByText('Delete')))
    await act(async () => fireEvent.click(screen.getByText('Yes')))

    expect(screen.getByText('Save')).toBeEnabled()
    expect(screen.getByText('Delete')).toBeEnabled()
  })

  it('should redirect to subscription list page if subscription has been removed', async () => {
    await renderComponent()

    fetch.jsonResponseOnce({status: 204})
    await act(async () => fireEvent.click(screen.getByText('Delete')))
    await act(async () => fireEvent.click(screen.getByText('Yes')))

    expect(history.action).toEqual('REPLACE')
    expect(history.location.pathname).toEqual('/app/subscriptions')
  })

  it('should show message if subscription has been deleted', async () => {
    await renderComponent()

    fetch.jsonResponseOnce({status: 204})
    await act(async () => fireEvent.click(screen.getByText('Delete')))
    await act(async () => fireEvent.click(screen.getByText('Yes')))

    expect(screen.queryByRole('dialog-info-message')).toHaveTextContent('Subscription deleted')
  })

  it('should show message if subscription could not be fetched', async () => {
    fetch.resetMocks()
    fetch.rejectResponse({status: 500, data: expectedError})
    await renderComponent()

    expect(screen.queryByRole('dialog-error-message')).toHaveTextContent(expectedError)
  })

  it('should show message if subscription tags could not be fetched', async () => {
    fetch.resetMocks()
    fetch.jsonResponseOnce(subscription)
    fetch.rejectResponse({status: 500, data: expectedError})
    await renderComponent()

    expect(screen.queryByRole('dialog-error-message')).toHaveTextContent(expectedError)
  })

  it('should show message if subscription exclusions could not be fetched', async () => {
    fetch.resetMocks()
    fetch.jsonResponseOnce(subscription)
    fetch.jsonResponseOnce(subscriptionTags)
    fetch.rejectResponse({status: 500, data: expectedError})
    await renderComponent()

    expect(screen.queryByRole('dialog-error-message')).toHaveTextContent(expectedError)
  })
})
