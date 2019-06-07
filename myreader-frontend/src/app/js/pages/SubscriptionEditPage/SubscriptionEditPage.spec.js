import React from 'react'
import {mount} from 'enzyme'
import SubscriptionEditPage from './SubscriptionEditPage'
import {SUBSCRIPTIONS_URL} from '../../constants'
import {subscriptionApi} from '../../api'
import {toast} from '../../components/Toast'
import {flushPromises, rejected, resolved} from '../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  SubscriptionEditForm: () => null
}))

jest.mock('../../contexts', () => ({
  withLocationState: Component => Component
}))

jest.mock('../../api', () => ({
  subscriptionApi: {}
}))

jest.mock('../../components/Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

describe('SubscriptionEditPage', () => {

  let state, dispatch, props

  const createWrapper = ({init} = {init: true}) => {
    const wrapper = mount(<SubscriptionEditPage {...props} state={state} dispatch={dispatch} />)
    if (init) {
      dispatch.mock.calls[0][0].success({
        uuid: '1',
        title: 'title1',
        origin: 'origin1',
        createdAt: '2017-12-29',
        feedTag: {
          uuid: '2',
          name: 'name 1'
        }
      })
      wrapper.update()
    }
    return wrapper
  }

  beforeEach(() => {
    toast.mockClear()
    dispatch = jest.fn()

    state = {
      subscription: {
        editForm: {
          changePending: true,
          data: {uuid: '1', title: 'title1', origin: 'origin1', feedTag: {uuid: '2', name: 'name 1'}, createdAt: '2017-12-29'},
          validations: [{field: 'title', message: 'validation message'}]
        },
        subscriptions: [
          {uuid: '1', title: 'title1', origin: 'origin1', feedTag: {uuid: '2', name: 'name 1'}, createdAt: '2017-12-29'},
          {uuid: '2', title: 'title2', origin: 'origin2', feedTag: {uuid: '3', name: 'name 2'}, createdAt: '2017-11-30'}
        ],
        exclusions: {
          '1': [{uuid: '10', pattern: 'exclusion1', hitCount: 1}, {uuid: '11', pattern: 'exclusion2', hitCount: 2}],
          '2': [{uuid: '13', pattern: 'exclusion3', hitCount: 2}],
        }
      }
    }

    props = {
      params: {
        uuid: '1'
      },
      historyReplace: jest.fn(),
      historyReload: jest.fn(),
      showSuccessNotification: jest.fn(),
      showErrorNotification: jest.fn()
    }
  })

  it('should not render component when state "subscription" is undefined', () => {
    expect(createWrapper({init: false}).find('SubscriptionEditForm').exists()).toEqual(false)
  })

  it('should render component when state "subscription" is defined', () => {
    expect(createWrapper().find('SubscriptionEditForm').exists()).toEqual(true)
  })

  it('should pass expected props to component', () => {
    expect(createWrapper().find('SubscriptionEditForm').props()).toEqual(expect.objectContaining({
      data: {
        uuid: '1',
        title: 'title1',
        origin: 'origin1',
        createdAt: '2017-12-29',
        feedTag: {
          uuid: '2',
          name: 'name 1'
        }
      },
      changePending: false,
      subscriptionTags: [
        {uuid: '2', name: 'name 1'},
        {uuid: '3', name: 'name 2'},
      ],
      validations: []
    }))
  })

  it('should dispatch action PATCH_SUBSCRIPTION when prop function "saveSubscriptionEditForm" triggered', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({
      uuid: '1',
      title: 'changed title',
      origin: 'origin',
      feedTag: {
        uuid: '2',
        name: 'changed feedTag name'
      }
    })

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PATCH_SUBSCRIPTION',
      url: 'api/2/subscriptions/1',
      body: {
        uuid: '1',
        title: 'changed title',
        origin: 'origin',
        feedTag: {
          uuid: '2',
          name: 'changed feedTag name'
        }
      }
    }))
  })

  it('should set prop "changePending" to true when prop function "saveSubscriptionEditForm" called', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('changePending')).toEqual(true)
  })

  it('should set prop "changePending" to false when prop function "saveSubscriptionEditForm" finished', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    wrapper.update()

    dispatch.mock.calls[0][0].finalize()
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('changePending')).toEqual(false)
  })

  it('should trigger prop function "showSuccessNotification" when prop function "saveSubscriptionEditForm" succeeded', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    wrapper.update()
    dispatch.mock.calls[0][0].success()

    expect(toast).toHaveBeenCalledWith('Subscription saved')
  })

  it('should pass state "validations" to feed edit page when prop function "saveSubscriptionEditForm" failed', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    wrapper.update()
    dispatch.mock.calls[0][0].error({status: 400, fieldErrors: ['error']})
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('validations')).toEqual(['error'])
  })

  it('should not pass state "validations" to feed edit page when prop function "saveSubscriptionEditForm" failed', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    wrapper.update()
    dispatch.mock.calls[0][0].error({status: 401, fieldErrors: ['error']})
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('validations')).toEqual([])
  })

  it('should clear state "validations" when prop function "saveSubscriptionEditForm" triggered', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    wrapper.update()
    dispatch.mock.calls[0][0].error({status: 400, fieldErrors: ['error']})
    wrapper.update()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('validations')).toEqual([])
  })

  it('should call subscriptionApi.deleteSubscription when prop function "deleteSubscription" triggered', () => {
    subscriptionApi.deleteSubscription = resolved()
    const wrapper = createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription('uuid1')

    expect(subscriptionApi.deleteSubscription).toHaveBeenCalledWith('uuid1')
  })

  it('should set prop "changePending" to true when prop function "deleteSubscription" called', () => {
    const wrapper = createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription('1')
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('changePending')).toEqual(true)
  })

  it('should not change state prop "changePending" when call to subscriptionApi.deleteSubscription failed', async () => {
    subscriptionApi.deleteSubscription = rejected()
    const wrapper = createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('changePending')).toEqual(false)
  })

  it('should trigger prop function "props.showErrorNotification" when call to subscriptionApi.deleteSubscription failed', async () => {
    subscriptionApi.deleteSubscription = rejected('expected error')
    const wrapper = createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription()
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith('expected error', {error: true})
  })

  it('should trigger prop function "showSuccessNotification" when call to subscriptionApi.deleteSubscription succeeded', async () => {
    subscriptionApi.deleteSubscription = resolved()
    const wrapper = createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription()
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith('Subscription deleted')
  })

  it('should change and reload location when call to subscriptionApi.deleteSubscription succeeded', async () => {
    subscriptionApi.deleteSubscription = resolved()
    const wrapper = createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription()
    await flushPromises()
    wrapper.update()

    expect(props.historyReplace).toHaveBeenCalledWith({pathname: SUBSCRIPTIONS_URL})
    expect(props.historyReload).toHaveBeenCalled()
  })

  it('should dispatch action GET_SUBSCRIPTION when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
      type: 'GET_SUBSCRIPTION',
      url: 'api/2/subscriptions/1'
    }))
  })
})
