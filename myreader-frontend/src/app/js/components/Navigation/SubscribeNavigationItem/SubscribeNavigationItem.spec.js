import {render, fireEvent, waitFor, screen, act} from '@testing-library/react'
import {SubscribeNavigationItem} from './SubscribeNavigationItem'
import {RouterProvider} from '../../../contexts/router'
import {NavigationProvider} from '../../../contexts/navigation/NavigationProvider'

const expectedUrl = 'expected url'
const expectedError = 'expected error'
const dialogErrorMessageRole = 'dialog-error-message'
const textAddSubscription = 'Add subscription'
const roleDialogInfoMessage = 'dialog-info-message'

const renderComponent = (props) => {
  return render(
    <RouterProvider>
      <NavigationProvider>
        <SubscribeNavigationItem {...props} />
      </NavigationProvider>
    </RouterProvider>
  )
}

describe('SubscribeNavigationItem', () => {

  let props

  beforeEach(() => {
    history.pushState(null, null, '#!/app/irrelevant')

    props = {
      onClick: jest.fn()
    }
  })

  it('should enable input and button when the page is presented', async () => {
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))

    expect(screen.getByLabelText('Url')).toBeEnabled()
    expect(screen.getByRole('button')).toBeEnabled()
    expect(screen.queryByRole('validations')).not.toBeInTheDocument()
  })

  it('should call api with entered url', async () => {
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    expect(fetch.mostRecent().url).toEqual('api/2/subscriptions')
    expect(fetch.mostRecent().method).toEqual('POST')
    expect(fetch.mostRecent().body).toEqual(JSON.stringify({
      origin: expectedUrl
    }))
  })

  it('should disable input and button when the call to the api is pending', async () => {
    fetch.responsePending()
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}})
    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByLabelText('Url')).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should show an info message when the call to the api succeeded', async () => {
    fetch.jsonResponseOnce({uuid: 'uuid1'})
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}})
    await act(async () => fireEvent.click(screen.getByRole('button')))

    expect(screen.getByRole(roleDialogInfoMessage)).toHaveTextContent('Subscribed')
    fireEvent.click(screen.getByRole(roleDialogInfoMessage))
  })

  it('should fetch navigation data when the call to the api succeeded', async () => {
    fetch.jsonResponse({subscriptions: []})
    fetch.jsonResponseOnce({uuid: 'uuid1'})
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}})
    await act(async () => fireEvent.click(screen.getByRole('button')))

    expect(fetch.mostRecent().url).toEqual('views/NavigationView')
    expect(fetch.mostRecent().method).toEqual('GET')
    fireEvent.click(screen.getByText('Subscribed'))
  })

  it('should redirect to the feed detail page when the call to the api succeeded', async () => {
    fetch.jsonResponse({subscriptions: []})
    const currentHistoryLength = history.length
    fetch.jsonResponseOnce({uuid: 'uuid1'})
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}})
    await act(async () => fireEvent.click(screen.getByRole('button')))

    await waitFor(() => {
      expect(history.length).toEqual(currentHistoryLength) // replace
      expect(document.location.href).toMatch(/\/app\/subscription\?uuid=uuid1$/)
      expect(props.onClick).toHaveBeenCalled()
    })
  })

  it('should present validation errors when the call to the api failed with an validation error', async () => {
    fetch.rejectResponse({status: 400, data: {errors: [{field: 'origin', defaultMessage: expectedError}]}})
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    expect(screen.getByRole('origin-validation')).toHaveTextContent(expectedError)
    expect(screen.queryByRole(dialogErrorMessageRole)).not.toBeInTheDocument()
  })

  it('should not present any validation errors when subsequent call to the api succeeded', async () => {
    fetch.rejectResponse({status: 400, data: {errors: [{field: 'origin', defaultMessage: expectedError}]}})
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    fetch.jsonResponseOnce({uuid: 'uuid1'})
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    await waitFor(() => expect(screen.queryByRole('validations')).not.toBeInTheDocument())
  })

  it('should not present any validation errors when the call to the api failed with some other error', async () => {
    fetch.rejectResponse({status: 401})
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    await waitFor(() => expect(screen.queryByRole('validations')).not.toBeInTheDocument())
  })

  it('should enable input and button when the call to the api failed with a validation error', async () => {
    fetch.rejectResponse({status: 400, data: {errors: [{field: 'origin', defaultMessage: expectedError}]}})
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}})
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByLabelText('Url')).toBeEnabled()
      expect(screen.getByRole('button')).toBeEnabled()
    })
  })

  it('should enable input and button when the call to the api failed with some other error', async () => {
    fetch.rejectResponse({data: expectedError})
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}})
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByLabelText('Url')).toBeEnabled()
      expect(screen.getByRole('button')).toBeEnabled()
    })
    fireEvent.click(screen.getByRole(dialogErrorMessageRole))
  })

  it('should present an error message when the call to the api failed with some other error', async () => {
    fetch.rejectResponse({data: expectedError})
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    await waitFor(() => expect(screen.getByRole(dialogErrorMessageRole)).toHaveTextContent(expectedError))
    fireEvent.click(screen.getByRole(dialogErrorMessageRole))
  })

  it('should not present an error message when the call to the api failed with an validation error', async () => {
    fetch.rejectResponse({status: 400, data: {errors: [{field: 'origin', defaultMessage: expectedError}]}})
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))
    await act(async () => fireEvent.change(screen.getByLabelText('Url'), {target: {value: expectedUrl}}))
    await act(async () => fireEvent.click(screen.getByRole('button')))

    expect(screen.getByRole('origin-validation')).toHaveTextContent(expectedError)
    await waitFor(() => expect(screen.queryByRole(dialogErrorMessageRole)).not.toBeInTheDocument())
  })

  it('should not trigger prop function "onClick" if item clicked', async () => {
    await renderComponent(props)
    fireEvent.click(screen.getByText(textAddSubscription))

    expect(props.onClick).not.toHaveBeenCalled()
  })
})
