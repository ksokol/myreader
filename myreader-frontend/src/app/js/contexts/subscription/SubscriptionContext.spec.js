import React from 'react'
import {mount} from 'enzyme'
import {SubscriptionProvider} from './SubscriptionProvider'
import SubscriptionContext from './SubscriptionContext'
import {subscriptionApi} from '../../api'
import {toast} from '../../components/Toast'
import {flushPromises, rejected, resolved} from '../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))

jest.mock('../../api', () => ({
  subscriptionApi: {}
}))

jest.mock('../../components/Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

class TestComponent extends React.Component {
  static contextType = SubscriptionContext
  render = () => 'expected component'
}

const expectedError = 'expected error'

describe('subscription context', () => {

  let dispatch, props, subscriptions

  const createWrapper = async (onMount = resolved(subscriptions)) => {
    subscriptionApi.fetchSubscriptions = onMount
    const wrapper = mount(
      <SubscriptionProvider {...props} dispatch={dispatch}>
        <TestComponent />
      </SubscriptionProvider>
    )
    await flushPromises()
    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    dispatch = jest.fn()
    toast.mockClear()

    subscriptions = [
      {uuid: '1'},
      {uuid: '2'}
    ]

    props = {
      locationReload: false
    }
  })

  it('should render children', async () => {
    const wrapper = await createWrapper()
    expect(wrapper.find(TestComponent).html()).toEqual('expected component')
  })

  it('should contain expected context values in child component', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find(TestComponent).instance().context).toEqual({subscriptions: []})
  })

  it('should dispatch action SUBSCRIPTIONS_RECEIVED when subscriptionApi.fetchSubscriptions succeeded', async () => {
    await createWrapper()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBSCRIPTIONS_RECEIVED',
      subscriptions: [
        {uuid: '1'},
        {uuid: '2'}
      ]
    })
  })

  it('should not dispatch action SUBSCRIPTIONS_RECEIVED when subscriptionApi.fetchSubscriptions failed', async () => {
    await createWrapper(rejected())

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should contain empty context value in child component when subscriptionApi.fetchSubscriptions succeeded', async () => {
    await createWrapper(rejected(expectedError))

    expect(toast).toHaveBeenCalledWith('expected error', {error: true})
  })

  it('should dispatch action SUBSCRIPTIONS_RECEIVED when prop "locationReload" is set to true and subscriptionApi.fetchSubscriptions succeeded', async () => {
    const wrapper = await createWrapper()
    subscriptionApi.fetchSubscriptions = resolved([{uuid: '3'}])
    dispatch.mockClear()
    wrapper.setProps({locationReload: true}, () => wrapper.setProps({locationReload: false}))
    await flushPromises()
    wrapper.update()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBSCRIPTIONS_RECEIVED',
      subscriptions: [
        {uuid: '3'}
      ]
    })
  })

  it('should not dispatch action SUBSCRIPTIONS_RECEIVED when prop "locationReload" is set to true and subscriptionApi.fetchSubscriptions failed', async () => {
    const wrapper = await createWrapper()
    subscriptionApi.fetchSubscriptions = rejected(expectedError)
    dispatch.mockClear()
    wrapper.setProps({locationReload: true}, () => wrapper.setProps({locationReload: false}))
    await flushPromises()
    wrapper.update()

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should trigger toast when prop "locationReload" is set to true and subscriptionApi.fetchSubscriptions failed', async () => {
    const wrapper = await createWrapper()
    subscriptionApi.fetchSubscriptions = rejected(expectedError)
    dispatch.mockClear()
    wrapper.setProps({locationReload: true}, () => wrapper.setProps({locationReload: false}))
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })
})
