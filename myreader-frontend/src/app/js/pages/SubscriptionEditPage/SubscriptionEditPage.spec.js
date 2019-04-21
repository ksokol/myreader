import React from 'react'
import {mount} from 'enzyme'
import SubscriptionEditPage from './SubscriptionEditPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  SubscriptionEditForm: () => null
}))
/* eslint-enable */

describe('SubscriptionEditPage', () => {

  let state, dispatch, props

  const createWrapper = ({init} = {init: true}) => {
    const wrapper = mount(<SubscriptionEditPage {...props} state={state} dispatch={dispatch} />)
    if (init) {
      dispatch.mock.calls[1][0].success({
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
    dispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
    })

    state = {
      common: {
        notification: {
          nextId: 1
        }
      },
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
      match: {
        params: {
          uuid: '1'
        }
      },
      history: {
        replace: jest.fn()
      }
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
      exclusions: [
        {uuid: '10', pattern: 'exclusion1', hitCount: 1},
        {uuid: '11', pattern: 'exclusion2', hitCount: 2}
      ],
      validations: []
    }))
  })

  it('should dispatch action POST_SUBSCRIPTION_EXCLUSION_PATTERN when prop function "addSubscriptionExclusionPattern" triggered', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().addSubscriptionExclusionPattern('1', 'changed tag')

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'POST_SUBSCRIPTION_EXCLUSION_PATTERN',
      url: 'api/2/exclusions/1/pattern',
      body: {
        pattern: 'changed tag'
      }
    }))
  })

  it('should dispatch action DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS when prop function "removeSubscriptionExclusionPattern" triggered', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().removeSubscriptionExclusionPattern('1', 'uuid 2')

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS',
      url: 'api/2/exclusions/1/pattern/uuid 2'
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

  it('should dispatch action SHOW_NOTIFICATION when prop function "saveSubscriptionEditForm" succeeded', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().saveSubscriptionEditForm({})
    wrapper.update()
    dispatch.mock.calls[0][0].success()(dispatch, () => state)

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'SHOW_NOTIFICATION',
      notification: {
        id: 1,
        text: 'Subscription saved',
        type: 'success'
      }
    })
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

  it('should dispatch action DELETE_SUBSCRIPTION when prop function "deleteSubscription" triggered', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription('1')

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_SUBSCRIPTION',
      url: 'api/2/subscriptions/1'
    }))
  })

  it('should set prop "changePending" to true when prop function "deleteSubscription" called', () => {
    const wrapper = createWrapper()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription('1')
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('changePending')).toEqual(true)
  })

  it('should set prop "changePending" to false when prop function "deleteSubscription" finished', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription('1')
    wrapper.update()
    dispatch.mock.calls[0][0].finalize()
    wrapper.update()

    expect(wrapper.find('SubscriptionEditForm').prop('changePending')).toEqual(false)
  })

  it('should dispatch action SHOW_NOTIFICATION when prop function "deleteSubscription" succeeded', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription('1')
    wrapper.update()
    const successActions = dispatch.mock.calls[0][0].success
    successActions[0]()(dispatch, () => state)

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'SHOW_NOTIFICATION',
      notification: {
        id: 1,
        text: 'Subscription deleted',
        type: 'success'
      }
    })
  })

  it('should dispatch action SUBSCRIPTION_DELETED when prop function "deleteSubscription" succeeded', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription('1')
    wrapper.update()
    const successActions = dispatch.mock.calls[0][0].success

    expect(successActions[1]()).toEqual({
      type: 'SUBSCRIPTION_DELETED',
      uuid: '1'
    })
  })

  it('should dispatch action ROUTE_CHANGED when prop function "deleteSubscription" succeeded', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription('1')
    wrapper.update()
    dispatch.mock.calls[0][0].success[2]()

    expect(props.history.replace).toHaveBeenCalledWith(expect.objectContaining({
      route: ['app', 'subscriptions']
    }))
  })

  it('should dispatch action GET_SUBSCRIPTION when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'GET_SUBSCRIPTION',
      url: 'api/2/subscriptions/1'
    }))
  })

  it('should dispatch action GET_SUBSCRIPTION_EXCLUSION_PATTERNS when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_SUBSCRIPTION_EXCLUSION_PATTERNS',
      url: 'api/2/exclusions/1/pattern'
    }))
  })
})
