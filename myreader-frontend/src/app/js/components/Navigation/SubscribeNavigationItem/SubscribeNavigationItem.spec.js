import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {render, fireEvent, waitFor, screen, act} from '@testing-library/react'
import {SubscribeNavigationItem} from './SubscribeNavigationItem'

const expectedUrl = 'expected url'
const expectedError = 'expected error'
const dialogErrorMessageRole = 'dialog-error-message'

describe('SubscribeNavigationItem', () => {

  let props, history

  const renderComponent = () => {
    render(
      <Router history={history}>
        <SubscribeNavigationItem {...props} />
      </Router>
    )
  }

  beforeEach(() => {
    history = createMemoryHistory()

    props = {
      onClick: jest.fn()
    }
  })

  it('should enable input and button when the page is presented', async () => {
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))

    expect(screen.getByLabelText('Url')).toBeEnabled()
    expect(screen.getByRole('button')).toBeEnabled()
    expect(screen.queryByRole('validations')).not.toBeInTheDocument()
  })

  it('should call api with entered url', async () => {
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    expect(fetch.mostRecent()).toMatchPostRequest({
      url: 'api/2/subscriptions',
      origin: expectedUrl,
    })
  })

  it('should disable input and button when the call to the api is pending', async () => {
    fetch.responsePending()
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))
    fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}})
    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByLabelText('Url')).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should show an info message when the call to the api succeeded', async () => {
    fetch.jsonResponseOnce({uuid: 'uuid1'})
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))
    fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}})
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => expect(screen.getByRole('dialog-info-message')).toHaveTextContent('Subscribed'))
  })

  it('should redirect to the feed detail page when the call to the api succeeded', async () => {
    fetch.jsonResponseOnce({uuid: 'uuid1'})
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))
    fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}})
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(history.location).toEqual(expect.objectContaining({
        pathname: '/app/subscriptions/uuid1',
      }))
      expect(props.onClick).toHaveBeenCalled()
    })
  })

  it('should present validation errors when the call to the api failed with an validation error', async () => {
    fetch.rejectResponse({status: 400, data: {errors: [{field: 'origin', defaultMessage: expectedError}]}})
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    expect(screen.getByRole('origin-validation')).toHaveTextContent(expectedError)
    expect(screen.queryByRole(dialogErrorMessageRole)).not.toBeInTheDocument()
  })

  it('should not present any validation errors when subsequent call to the api succeeded', async () => {
    fetch.rejectResponse({status: 400, data: {errors: [{field: 'origin', defaultMessage: expectedError}]}})
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    fetch.jsonResponseOnce({uuid: 'uuid1'})
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    await waitFor(() => expect(screen.queryByRole('validations')).not.toBeInTheDocument())
  })

  it('should not present any validation errors when the call to the api failed with some other error', async () => {
    fetch.rejectResponse({status: 401})
    await renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    await waitFor(() => expect(screen.queryByRole('validations')).not.toBeInTheDocument())
  })

  it('should enable input and button when the call to the api failed with a validation error', async () => {
    fetch.rejectResponse({status: 400, data: {errors: [{field: 'origin', defaultMessage: expectedError}]}})
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))
    fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}})
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByLabelText('Url')).toBeEnabled()
      expect(screen.getByRole('button')).toBeEnabled()
    })
  })

  it('should enable input and button when the call to the api failed with some other error', async () => {
    fetch.rejectResponse({data: expectedError})
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))
    fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}})
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByLabelText('Url')).toBeEnabled()
      expect(screen.getByRole('button')).toBeEnabled()
    })
  })

  it('should present an error message when the call to the api failed with some other error', async () => {
    fetch.rejectResponse({data: expectedError})
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    await waitFor(() => expect(screen.getByRole(dialogErrorMessageRole)).toHaveTextContent(expectedError))
  })

  it('should not present an error message when the call to the api failed with an validation error', async () => {
    fetch.rejectResponse({status: 400, data: {errors: [{field: 'origin', defaultMessage: expectedError}]}})
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    expect(screen.getByRole('origin-validation')).toHaveTextContent(expectedError)
    await waitFor(() => expect(screen.queryByRole(dialogErrorMessageRole)).not.toBeInTheDocument())
  })

  it('should not trigger prop function "onClick" if item clicked', async () => {
    renderComponent()
    fireEvent.click(screen.getByText('Add subscription'))

    expect(props.onClick).not.toHaveBeenCalled()
  })
})
