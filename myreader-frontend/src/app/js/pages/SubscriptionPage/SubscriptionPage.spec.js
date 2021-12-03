import {render, fireEvent, screen, act} from '@testing-library/react'
import {Router, Route, Switch} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import iro from '@jaames/iro'
import {SubscriptionPage} from './SubscriptionPage'
import {NavigationProvider} from '../../contexts/navigation/NavigationProvider'

const expectedError = 'expectedError'
const expectedTitle = 'expected title'
const expectedOrigin = 'http://example.com'
const roleTitleValidation = 'title-validation'
const roleChipRemoveButton = 'chip-remove-button'
const roleDialogErrorMessage = 'dialog-error-message'
const placeholderExclusionPatternInput = 'Enter an exclusion pattern'
const viewsSubscriptionPage1Subscription = 'views/SubscriptionPage/1/subscription'

describe('SubscriptionPage', () => {

  let history, subscription

  const renderComponent = async () => {
    await act(async () => {
      render(
        <Router history={history}>
          <NavigationProvider>
            <Switch>
              <Route
                exact={true}
                path='/:uuid'
                component={SubscriptionPage}
              />
            </Switch>
          </NavigationProvider>
        </Router>
      )
    })
  }

  let response

  beforeEach(() => {
    response = {
      subscription: {
        uuid: '1',
        title: expectedTitle,
        origin: expectedOrigin,
        tag: 'tag1',
        color: '#FF11FF',
      },
      tags: ['tag1', 'tag2'],
      exclusionPatterns: [
        {uuid: '100', pattern: 'pattern1', hitCount: 1},
        {uuid: '200', pattern: 'pattern2', hitCount: 2},
        {uuid: '300', pattern: 'pattern3', hitCount: 3}
      ],
      fetchErrors: [
        {uuid: '10', message: 'message 1', createdAt: '2021-02-27T06:48:05.087+01:00'},
        {uuid: '20', message: 'message 2', createdAt: '2021-02-27T07:48:05.087+01:00'}
      ]
    }

    history = createMemoryHistory()
    history.push({pathname: '1'})

    fetch.jsonResponseOnce(response)
  })

  it('should not render page if still loading', async () => {
    fetch.resetMocks()
    fetch.responsePending()
    await renderComponent()

    expect(screen.queryByRole('input')).not.toBeInTheDocument()
    expect(screen.queryByText('Save')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    expect(screen.queryByRole('validations')).not.toBeInTheDocument()
  })

  it('should call endpoint for given id', async () => {
    await renderComponent()

    expect(fetch.first()).toMatchRequest({
      method: 'GET',
      url: 'views/SubscriptionPage/1'
    })
  })

  it('should render page', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(1_614_453_487_714)
    await renderComponent()

    expect(screen.queryByDisplayValue(expectedTitle)).toBeVisible()
    expect(screen.queryByDisplayValue(expectedOrigin)).toBeVisible()
    expect(screen.queryByDisplayValue('tag1')).toBeVisible()
    expect(screen.getByText('Save')).toBeEnabled()
    expect(screen.getByText('Delete')).toBeEnabled()
    expect(screen.getByText('Delete')).toBeEnabled()
    expect(screen.getByText('pattern1')).toBeVisible()
    expect(screen.getByText('pattern2')).toBeVisible()
    expect(screen.getByText('pattern3')).toBeVisible()
    expect(screen.queryByRole(roleTitleValidation)).not.toBeInTheDocument()
    expect(screen.getByText('Fetch errors')).toBeVisible()
    expect(screen.getByText('message 1')).toBeVisible()
    expect(screen.getByText('13 hours ago')).toBeVisible()
    expect(screen.getByText('message 2')).toBeVisible()
    expect(screen.getByText('12 hours ago')).toBeVisible()
  })

  it('not should render fetch errors if no errors present', async () => {
    fetch.resetMocks()
    fetch.jsonResponseOnce({
      ...response,
      fetchErrors: [],
    })
    await renderComponent()

    expect(screen.queryByText('Fetch errors')).not.toBeInTheDocument()
  })

  it('should save subscription', async () => {
    await renderComponent()

    fireEvent.change(screen.queryByDisplayValue(expectedTitle), {target: {value: 'changed title'}})
    fireEvent.change(screen.queryByDisplayValue(expectedOrigin), {target: {value: 'changed origin'}})
    fireEvent.change(screen.queryByDisplayValue('tag1'), {target: {value: 'changed tag'}})

    fireEvent.click(screen.queryByRole('color-picker-button'))
    expect(screen.getByText('use')).toBeInTheDocument()
    act(() => iro.mock.onChange('#DDDDDD'))
    fireEvent.click(screen.getByText('use'))
    expect(screen.queryByText('use')).not.toBeInTheDocument()

    await act(async () => await fireEvent.click(screen.getByText('Save')))

    expect(fetch.nthRequest(2)).toMatchRequest({
      method: 'PATCH',
      url: viewsSubscriptionPage1Subscription,
      body: {
        uuid: '1',
        title: 'changed title',
        origin: 'changed origin',
        tag: 'changed tag',
        color: '#DDDDDD',
      },
    })
  })

  it('should disable save and delete buttons if subscription is still saving', async () => {
    await renderComponent()

    fetch.responsePending()
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.getByText('Save')).toBeDisabled()
    expect(screen.getByText('Delete')).toBeDisabled()

    expect(screen.getAllByRole(roleChipRemoveButton)).toHaveLength(3)
    expect(screen.getAllByRole(roleChipRemoveButton)[0]).toBeDisabled()
    expect(screen.getAllByRole(roleChipRemoveButton)[1]).toBeDisabled()
    expect(screen.getAllByRole(roleChipRemoveButton)[2]).toBeDisabled()
  })

  it('should enable save and delete buttons if subscription is saved', async () => {
    await renderComponent()

    fetch.jsonResponseOnce({subscription: response.subscription})
    fetch.jsonResponseOnce({content: []})
    await act(async () => await fireEvent.click(screen.getByText('Save')))

    expect(screen.getByText('Save')).toBeEnabled()
    expect(screen.getByText('Delete')).toBeEnabled()
    expect(screen.queryByRole('dialog-info-message')).toHaveTextContent('Updated')
    expect(fetch.mostRecent()).toMatchRequest({
      method: 'GET',
      url: 'views/NavigationView'
    })
  })

  it('should show url validation message', async() => {
    await renderComponent()

    fetch.rejectResponse({status: 400, data: {errors: [{field: 'title', defaultMessage: expectedError}]}})
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole(roleTitleValidation)).toHaveTextContent(expectedError)
  })

  it('should show origin validation message', async() => {
    await renderComponent()

    fetch.rejectResponse({status: 400, data: {errors: [{field: 'origin', defaultMessage: expectedError}]}})
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole('origin-validation')).toHaveTextContent(expectedError)
  })

  it('should remove validation message if subscription should be saved again', async () => {
    await renderComponent()

    fetch.jsonResponseOnce(subscription)
    await act(async () => fireEvent.click(screen.getByText('Save')))
    fetch.responsePending()
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole(roleTitleValidation)).not.toBeInTheDocument()
  })

  it('should show message if subscription could not be saved', async() => {
    await renderComponent()

    fetch.rejectResponse({status: 500, data: expectedError})
    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(screen.queryByRole(roleTitleValidation)).not.toBeInTheDocument()
    expect(screen.queryByRole(roleDialogErrorMessage)).toHaveTextContent(expectedError)
  })

  it('should remove subscription', async () => {
    await renderComponent()
    fetch.resetMocks()

    fetch.jsonResponseOnce({status: 204})
    await act(async () => fireEvent.click(screen.getByText('Delete')))
    await act(async () => fireEvent.click(screen.getByText('Yes')))

    expect(fetch.first()).toMatchRequest({
      method: 'DELETE',
      url: viewsSubscriptionPage1Subscription
    })
  })

  it('should fetch subscriptions if subscription has been removed', async() => {
    await renderComponent()

    fetch.jsonResponseOnce({status: 204})
    await act(async () => fireEvent.click(screen.getByText('Delete')))
    await act(async () => fireEvent.click(screen.getByText('Yes')))

    expect(fetch.mostRecent()).toMatchRequest({
      method: 'GET',
      url: 'views/NavigationView'
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

    expect(screen.queryByRole(roleDialogErrorMessage)).toHaveTextContent(expectedError)
  })

  it('should remove subscription color', async () => {
    await renderComponent()

    fireEvent.click(screen.queryByRole('color-picker-button'))
    expect(screen.getByText('use')).toBeInTheDocument()
    fireEvent.click(screen.getByText('reset'))
    fireEvent.click(screen.getByText('use'))
    expect(screen.queryByText('use')).not.toBeInTheDocument()

    await act(async () => fireEvent.click(screen.getByText('Save')))

    expect(fetch.nthRequest(2)).toMatchRequest({
      method: 'PATCH',
      url: viewsSubscriptionPage1Subscription,
      body: {
        uuid: '1',
        title: expectedTitle,
        origin: expectedOrigin,
        tag: 'tag1',
        color: null,
      },
    })
  })

  it('should save exclusion pattern', async () => {
    await renderComponent()

    fetch.responsePending()
    fireEvent.change(screen.getByPlaceholderText(placeholderExclusionPatternInput), {target: {value: 'anPattern'}})
    fireEvent.keyUp(screen.getByDisplayValue('anPattern'), {key: 'Enter', keyCode: 13})

    expect(fetch.mostRecent()).toMatchRequest({
      method: 'POST',
      url: 'views/SubscriptionPage/1/exclusionPatterns',
      body: {
        pattern: 'anPattern'
      }
    })
  })

  it('should disable all exclusion pattern delete buttons if exclusion pattern is still saving', async () => {
    await renderComponent()

    fetch.responsePending()
    fireEvent.change(screen.getByPlaceholderText(placeholderExclusionPatternInput), {target: {value: 'anPattern'}})
    fireEvent.keyUp(screen.getByDisplayValue('anPattern'), {key: 'Enter', keyCode: 13})

    expect(screen.getByPlaceholderText(placeholderExclusionPatternInput)).toBeDisabled()
    expect(screen.getAllByRole(roleChipRemoveButton)).toHaveLength(3)
    expect(screen.getAllByRole(roleChipRemoveButton)[0]).toBeDisabled()
    expect(screen.getAllByRole(roleChipRemoveButton)[1]).toBeDisabled()
    expect(screen.getAllByRole(roleChipRemoveButton)[2]).toBeDisabled()
  })

  it('should enable all exclusion pattern delete buttons if exclusion pattern has been saved', async () => {
    await renderComponent()

    fetch.jsonResponse({
      exclusionPatterns: [
        {uuid: '100', pattern: 'c', hitCount: 1},
        {uuid: '200', pattern: 'aa', hitCount: 2},
        {uuid: '300', pattern: 'a', hitCount: 3},
        {uuid: '400', pattern: 'anPattern', hitCount: 0}
      ]
    })
    fireEvent.change(screen.getByPlaceholderText(placeholderExclusionPatternInput), {target: {value: 'anPattern'}})
    await act(async () => await fireEvent.keyUp(screen.getByDisplayValue('anPattern'), {key: 'Enter', keyCode: 13}))

    expect(screen.getByPlaceholderText(placeholderExclusionPatternInput)).toBeEnabled()
    expect(screen.getAllByRole(roleChipRemoveButton)).toHaveLength(4)
    expect(screen.getAllByRole(roleChipRemoveButton)[0]).toBeEnabled()
    expect(screen.getAllByRole(roleChipRemoveButton)[1]).toBeEnabled()
    expect(screen.getAllByRole(roleChipRemoveButton)[2]).toBeEnabled()
    expect(screen.getAllByRole(roleChipRemoveButton)[3]).toBeEnabled()
  })

  it('should show message if new exclusion pattern could not be saved', async () => {
    await renderComponent()

    fetch.rejectResponse({data: expectedError})
    fireEvent.change(screen.getByPlaceholderText(placeholderExclusionPatternInput), {target: {value: 'anPattern'}})
    await act(async () => await fireEvent.keyUp(screen.getByDisplayValue('anPattern'), {key: 'Enter', keyCode: 13}))

    expect(screen.getByRole(roleDialogErrorMessage)).toHaveTextContent(expectedError)
  })

  it('should show exclusion pattern after new exclusion pattern has been saved', async () => {
    await renderComponent()

    fetch.jsonResponse({
      exclusionPatterns: [
        {uuid: '100', pattern: 'c', hitCount: 1},
        {uuid: '400', pattern: 'anPattern', hitCount: 0}
      ]
    })
    fireEvent.change(screen.getByPlaceholderText(placeholderExclusionPatternInput), {target: {value: 'anPattern'}})
    await act(async () => await fireEvent.keyUp(screen.getByDisplayValue('anPattern'), {key: 'Enter', keyCode: 13}))

    expect(screen.getByPlaceholderText(placeholderExclusionPatternInput)).toBeEnabled()
    expect(screen.getByText('c')).toBeVisible()
    expect(screen.getByText('anPattern')).toBeVisible()
  })

  it('disable all exclusion pattern delete buttons if exclusion patterns is still deleting', async () => {
    await renderComponent()

    fetch.responsePending()
    fireEvent.click(screen.getAllByRole(roleChipRemoveButton)[0])

    expect(screen.getByPlaceholderText(placeholderExclusionPatternInput)).toBeDisabled()
    expect(screen.getAllByRole(roleChipRemoveButton)).toHaveLength(3)
    expect(screen.getAllByRole(roleChipRemoveButton)[0]).toBeDisabled()
    expect(screen.getAllByRole(roleChipRemoveButton)[1]).toBeDisabled()
    expect(screen.getAllByRole(roleChipRemoveButton)[2]).toBeDisabled()
  })

  it('should enable all exclusion pattern delete buttons if exclusion pattern has been deleted', async () => {
    await renderComponent()

    fetch.jsonResponse({
      exclusionPatterns: [
        {uuid: '100', pattern: 'c', hitCount: 1},
        {uuid: '400', pattern: 'anPattern', hitCount: 0}
      ]
    })
    await (act(async() => await fireEvent.click(screen.getAllByRole(roleChipRemoveButton)[0])))

    expect(screen.getByPlaceholderText(placeholderExclusionPatternInput)).toBeEnabled()
    expect(screen.getAllByRole(roleChipRemoveButton)).toHaveLength(2)
    expect(screen.getAllByRole(roleChipRemoveButton)[0]).toBeEnabled()
    expect(screen.getAllByRole(roleChipRemoveButton)[1]).toBeEnabled()
  })

  it('should show message if exclusion pattern could not be deleted', async () => {
    await renderComponent()

    fetch.rejectResponse({data: expectedError})
    await act(async () => await fireEvent.click(screen.getAllByRole(roleChipRemoveButton)[0]))

    expect(screen.getByRole(roleDialogErrorMessage)).toHaveTextContent(expectedError)
  })

  it('should delete exclusion pattern', async () => {
    await renderComponent()

    fetch.rejectResponse({data: expectedError})
    await act(async () => await fireEvent.click(screen.getAllByRole(roleChipRemoveButton)[0]))

    expect(fetch.mostRecent()).toMatchRequest({
      method: 'DELETE',
      url: 'views/SubscriptionPage/1/exclusionPatterns/100',
    })
  })
})
