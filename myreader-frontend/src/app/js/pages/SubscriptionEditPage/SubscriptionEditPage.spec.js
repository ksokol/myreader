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

  const createWrapper = () => mount(<SubscriptionEditPage {...props} state={state} dispatch={dispatch} />)

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
    })

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
      match: {
        params: {
          uuid: '1'
        }
      }
    }
  })

  it('should not render component when prop "data" is undefined', () => {
    state.subscription.editForm.data = undefined

    expect(createWrapper().find('SubscriptionEditForm').exists()).toEqual(false)
  })

  it('should render component when prop "data" is defined', () => {
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
      changePending: true,
      subscriptionTags: [
        {uuid: '2', name: 'name 1'},
        {uuid: '3', name: 'name 2'},
      ],
      exclusions: [
        {uuid: '10', pattern: 'exclusion1', hitCount: 1},
        {uuid: '11', pattern: 'exclusion2', hitCount: 2}
      ],
      validations: [
        {field: 'title', message: 'validation message'}
      ]
    }))
  })

  it('should dispatch action SUBSCRIPTION_EDIT_FORM_CHANGE_DATA when prop function "subscriptionEditFormChangeData" triggered', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().subscriptionEditFormChangeData({
      uuid: '1',
      title: 'changed title',
      origin: 'origin',
      feedTag: {
        uuid: '2',
        name: 'changed feedTag name'
      }
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBSCRIPTION_EDIT_FORM_CHANGE_DATA',
      data: {
        uuid: '1',
        title: 'changed title',
        origin: 'origin',
        feedTag: {
          uuid: '2',
          name: 'changed feedTag name'
        }
      }
    })
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

  it('should dispatch action DELETE_SUBSCRIPTION when prop function "deleteSubscription" triggered', () => {
    const wrapper = createWrapper()
    dispatch.mockReset()
    wrapper.find('SubscriptionEditForm').props().deleteSubscription('1')

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_SUBSCRIPTION',
      url: 'api/2/subscriptions/1'
    }))
  })

  it('should dispatch action SUBSCRIPTION_EDIT_FORM_CLEAR when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBSCRIPTION_EDIT_FORM_CLEAR'
    })
  })

  it('should dispatch action SUBSCRIPTION_EDIT_FORM_LOAD when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(3, {
      type: 'SUBSCRIPTION_EDIT_FORM_LOAD',
      subscription: {
        uuid: '1',
        title: 'title1',
        origin: 'origin1',
        createdAt: '2017-12-29',
        feedTag: {
          uuid: '2',
          name: 'name 1'
        }
      }
    })
  })

  it('should dispatch action GET_SUBSCRIPTION_EXCLUSION_PATTERNS when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(4, expect.objectContaining({
      type: 'GET_SUBSCRIPTION_EXCLUSION_PATTERNS',
      url: 'api/2/exclusions/1/pattern'
    }))
  })
})
