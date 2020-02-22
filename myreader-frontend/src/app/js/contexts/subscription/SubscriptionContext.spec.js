import React from 'react'
import {mount} from 'enzyme'
import {SubscriptionProvider} from './SubscriptionProvider'
import SubscriptionContext from './SubscriptionContext'
import {subscriptionApi} from '../../api'
import {toast} from '../../components/Toast'
import {flushPromises, rejected, resolved} from '../../shared/test-utils'
import {SubscriptionProviderInterceptor} from './SubscriptionProviderInterceptor'

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

jest.mock('./SubscriptionProviderInterceptor', () => ({
  SubscriptionProviderInterceptor: jest.fn()
}))
/* eslint-enable */

class TestComponent extends React.Component {
  static contextType = SubscriptionContext
  render = () => 'expected component'
}

const expectedError = 'expected error'

describe('subscription context', () => {

  let props, subscriptions

  const createWrapper = async (onMount = resolved(subscriptions)) => {
    subscriptionApi.fetchSubscriptions = onMount
    const wrapper = mount(
      <SubscriptionProvider {...props}>
        <TestComponent />
      </SubscriptionProvider>
    )
    await flushPromises()
    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    toast.mockClear()
    SubscriptionProviderInterceptor.mockClear()
    subscriptionApi.addInterceptor = jest.fn()
    subscriptionApi.removeInterceptor = jest.fn()

    subscriptions = [
      {uuid: '1', unseen: 3},
      {uuid: '2', unseen: 2}
    ]

    props = {
      locationStateStamp: 0
    }
  })

  it('should render children', async () => {
    const wrapper = await createWrapper()
    expect(wrapper.find(TestComponent).html()).toEqual('expected component')
  })

  it('should contain expected context values in child component when subscriptionApi.fetchSubscriptions succeeded', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find(TestComponent).instance().context).toEqual({
      subscriptions: [
        {uuid: '1', unseen: 3},
        {uuid: '2', unseen: 2}
      ]
    })
  })

  it('should contain empty context value in child component when subscriptionApi.fetchSubscriptions succeeded', async () => {
    await createWrapper(rejected({data: expectedError}))

    expect(toast).toHaveBeenCalledWith('expected error', {error: true})
  })

  it('should contain expected context values in child component when prop "locationStateStamp" changed and subscriptionApi.fetchSubscriptions succeeded', async () => {
    const wrapper = await createWrapper()
    subscriptionApi.fetchSubscriptions = resolved([{uuid: '3'}])
    wrapper.setProps({locationStateStamp: 1})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find(TestComponent).instance().context).toEqual({
      subscriptions: [
        {uuid: '3'}
      ]
    })
  })

  it('should contain expected context values in child component when prop "locationStateStamp" changed and subscriptionApi.fetchSubscriptions failed', async () => {
    const wrapper = await createWrapper()
    subscriptionApi.fetchSubscriptions = rejected(expectedError)
    wrapper.setProps({locationStateStamp: 1})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find(TestComponent).instance().context).toEqual({
      subscriptions: [
        {uuid: '1', unseen: 3},
        {uuid: '2', unseen: 2}
      ]
    })
  })

  it('should trigger toast when prop "locationStateStamp" changed and subscriptionApi.fetchSubscriptions failed', async () => {
    const wrapper = await createWrapper()
    subscriptionApi.fetchSubscriptions = rejected({data: expectedError})
    wrapper.setProps({locationStateStamp: 1})
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should decrease subscription unseen count', async () => {
    const wrapper = await createWrapper()
    SubscriptionProviderInterceptor.mock.calls[0][0](
      {feedUuid: '1', unseen: 3, seen: true},
      {feedUuid: '1', unseen: 2, seen: false}
    )

    expect(wrapper.find(TestComponent).instance().context).toEqual({
      subscriptions: [
        {uuid: '1', unseen: 2},
        {uuid: '2', unseen: 2}
      ]
    })
  })

  it('should increase subscription unseen count', async () => {
    const wrapper = await createWrapper()
    SubscriptionProviderInterceptor.mock.calls[0][0](
      {feedUuid: '1', unseen: 3, seen: false},
      {feedUuid: '1', unseen: 2, seen: true}
    )

    expect(wrapper.find(TestComponent).instance().context).toEqual({
      subscriptions: [
        {uuid: '1', unseen: 4},
        {uuid: '2', unseen: 2}
      ]
    })
  })

  it('should do nothing when seen flag does not changed', async () => {
    const wrapper = await createWrapper()
    SubscriptionProviderInterceptor.mock.calls[0][0](
      {feedUuid: '1', unseen: 3, seen: false},
      {feedUuid: '1', unseen: 2, seen: false}
    )

    expect(wrapper.find(TestComponent).instance().context).toEqual({
      subscriptions: [
        {uuid: '1', unseen: 3},
        {uuid: '2', unseen: 2}
      ]
    })
  })

  it('should do nothing when subscription is not available', async () => {
    const wrapper = await createWrapper()
    SubscriptionProviderInterceptor.mock.calls[0][0](
      {feedUuid: '3', unseen: 3, seen: true},
      {feedUuid: '3', unseen: 2, seen: false}
    )

    expect(wrapper.find(TestComponent).instance().context).toEqual({
      subscriptions: [
        {uuid: '1', unseen: 3},
        {uuid: '2', unseen: 2}
      ]
    })
  })

  it('should remove interceptor on unmount', async () => {
    const wrapper = await createWrapper()
    wrapper.unmount()

    expect(subscriptionApi.removeInterceptor.mock.calls[0][0]).toBeInstanceOf(SubscriptionProviderInterceptor)
  })

})
