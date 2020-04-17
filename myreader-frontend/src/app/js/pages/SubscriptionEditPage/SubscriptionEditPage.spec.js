import React from 'react'
import {mount} from 'enzyme'
import SubscriptionEditPage from './SubscriptionEditPage'
import {SUBSCRIPTIONS_URL} from '../../constants'
import {subscriptionApi, subscriptionTagsApi} from '../../api'
import {toast} from '../../components/Toast'
import {flushPromises, pending, rejected, resolved} from '../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  SubscriptionEditForm: () => null
}))

jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))

jest.mock('../../api', () => ({
  subscriptionApi: {},
  subscriptionTagsApi: {}
}))

jest.mock('../../components/Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

const expectedError = 'expectedError'

describe('SubscriptionEditPage', () => {

  let props

  const createWrapper = async ({subscription, tags} = {subscription: resolved(), tags: resolved()}) => {
    subscriptionApi.fetchSubscription = subscription
    subscriptionTagsApi.fetchSubscriptionTags = tags
    const wrapper = mount(<SubscriptionEditPage {...props} />)
    await flushPromises()
    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    toast.mockClear()

    props = {
      params: {
        uuid: 'uuid1'
      },
      historyReplace: jest.fn(),
      historyReload: jest.fn()
    }
  })

  it('should not render component when call to subscriptionApi.fetchSubscription is pending', async () => {
    const wrapper = await createWrapper({subscription: pending()})

    expect(wrapper.find('SubscriptionEditForm').exists()).toEqual(false)
  })

  it('should render component when call to subscriptionApi.fetchSubscription succeeded', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('SubscriptionEditForm').exists()).toEqual(true)
  })

  it('should call subscriptionApi.saveSubscription when prop function "saveSubscriptionEditForm" triggered', async () => {
    subscriptionApi.saveSubscription = pending()
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({a: 'b', c: 'd'})

    expect(subscriptionApi.saveSubscription).toHaveBeenCalledWith({
      a: 'b',
      c: 'd'
    })
  })

  it('should set prop "changePending" to true when subscriptionApi.saveSubscription is pending', async () => {
    subscriptionApi.saveSubscription = pending()
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('changePending')).toEqual(true)
  })

  it('should set prop "changePending" to false when subscriptionApi.saveSubscription finished', async () => {
    subscriptionApi.saveSubscription = resolved({})
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('changePending')).toEqual(false)
  })

  it('should trigger toast when subscriptionApi.saveSubscription succeeded', async() => {
    subscriptionApi.saveSubscription = resolved({})
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith('Subscription saved')
  })

  it('should trigger prop function "historyReload" when subscriptionApi.saveSubscription succeeded', async() => {
    subscriptionApi.saveSubscription = resolved({})
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    await flushPromises()
    wrapper.update()

    expect(props.historyReload).toHaveBeenCalled()
  })

  it('should pass state "validations" to feed edit page when subscriptionApi.saveSubscription failed with HTTP 400', async() => {
    subscriptionApi.saveSubscription = rejected({status: 400, data: {errors: ['error']}})
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('validations')).toEqual(['error'])
  })

  it('should not pass state "validations" to feed edit page when subscriptionApi.saveSubscription failed with HTTP !== 400', async() => {
    subscriptionApi.saveSubscription = rejected({status: 401, fieldErrors: ['error']})
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('validations')).toEqual([])
  })

  it('should clear state "validations" when subscriptionApi.saveSubscription called again', async () => {
    subscriptionApi.saveSubscription = rejected({status: 400, data: {fieldErrors: ['error']}})
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    await flushPromises()
    wrapper.update()
    subscriptionApi.saveSubscription = pending()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('validations')).toEqual([])
  })

  it('should call subscriptionApi.deleteSubscription when prop function "deleteSubscription" triggered', async () => {
    subscriptionApi.deleteSubscription = resolved()
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription('uuid1')

    expect(subscriptionApi.deleteSubscription).toHaveBeenCalledWith('uuid1')
  })

  it('should set prop "changePending" to true when prop function "deleteSubscription" called', async () => {
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription('1')
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('changePending')).toEqual(true)
  })

  it('should not change state prop "changePending" when call to subscriptionApi.deleteSubscription failed', async () => {
    subscriptionApi.deleteSubscription = rejected()
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('changePending')).toEqual(false)
  })

  it('should trigger prop function "props.showErrorNotification" when call to subscriptionApi.deleteSubscription failed', async () => {
    subscriptionApi.deleteSubscription = rejected({data: 'expected error'})
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription()
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith('expected error', {error: true})
  })

  it('should trigger prop function "showSuccessNotification" when call to subscriptionApi.deleteSubscription succeeded', async () => {
    subscriptionApi.deleteSubscription = resolved()
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription()
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith('Subscription deleted')
  })

  it('should change and reload location when call to subscriptionApi.deleteSubscription succeeded', async () => {
    subscriptionApi.deleteSubscription = resolved()
    const wrapper = await createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription()
    await flushPromises()
    wrapper.update()

    expect(props.historyReplace).toHaveBeenCalledWith({pathname: SUBSCRIPTIONS_URL})
    expect(props.historyReload).toHaveBeenCalled()
  })

  it('should call subscriptionApi.fetchSubscription and subscriptionTagsApi.fetchSubscriptionTags when mounted', async () => {
    await createWrapper()

    expect(subscriptionApi.fetchSubscription).toHaveBeenCalledWith('uuid1')
    expect(subscriptionTagsApi.fetchSubscriptionTags).toHaveBeenCalled()
  })

  it('should show toast when call to subscriptionApi.fetchSubscription failed on mount', async () => {
    await createWrapper({subscription: rejected({data: expectedError})})

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should show toast when call to subscriptionApi.fetchSubscriptionTags failed on mount', async () => {
    await createWrapper({subscription: resolved(), tags: rejected({data: expectedError})})

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should pass tags to component when call too subscriptionApi.fetchSubscriptionTags succeeded', async () => {
    const wrapper = await createWrapper({subscription: resolved(), tags: resolved({content: 'expected tags'})})

    expect(wrapper.find('SubscriptionEditForm').prop('subscriptionTags')).toEqual('expected tags')
  })
})
