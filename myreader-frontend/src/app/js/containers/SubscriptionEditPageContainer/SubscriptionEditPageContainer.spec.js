import React from 'react'
import {mount} from 'enzyme'
import SubscriptionEditPageContainer from './SubscriptionEditPageContainer'

/* eslint-disable react/prop-types */
jest.mock('../../pages', () => ({
  SubscriptionEditPage: () => null
}))
/* eslint-enable */

describe('SubscriptionEditPageContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<SubscriptionEditPageContainer dispatch={dispatch} {...state} />).find('SubscriptionEditPage')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      router: {
        query: {
          uuid: '1'
        }
      },
      subscription: {
        editForm: {
          changePending: true,
          data: {uuid: '1', title: 'title1', origin: 'origin1', feedTag: {uuid: '2', name: 'tag'}, createdAt: '2017-12-29'},
          validations: [{field: 'title', message: 'may not be empty'}]
        },
        subscriptions: [
          {uuid: '1', title: 'title1', origin: 'origin1', feedTag: {uuid: '2', name: 'tag'}, createdAt: '2017-12-29'},
          {uuid: '2', title: 'title2', origin: 'origin2', feedTag: {uuid: '2', name: 'tag'}, createdAt: '2017-11-30'},
          {uuid: '3', title: 'title3', origin: 'origin3', feedTag: {uuid: '3', name: 'tag1'}, createdAt: '2017-12-01'},
        ],
        exclusions: {
          '1': [{uuid: '10', pattern: 'exclusion1', hitCount: 1}, {uuid: '11', pattern: 'exclusion2', hitCount: 2}],
          '2': [{uuid: '13', pattern: 'exclusion3', hitCount: 2}],
        }
      }
    }
  })

  it('should initialize component with given props', () => {
    expect(createWrapper().props()).toContainObject({
      changePending: true,
      data: {uuid: '1', title: 'title1', origin: 'origin1', feedTag: {uuid: '2', name: 'tag'}, createdAt: '2017-12-29'},
      validations: [{field: 'title', message: 'may not be empty'}],
      subscriptionTags: [{uuid: '2', name: 'tag'}, {uuid: '3', name: 'tag1'}],
      exclusions: [{uuid: '10', pattern: 'exclusion1'}, {uuid: '11', pattern: 'exclusion2'}]
    })
  })

  it('should dispatch expected action when prop function "onChangeFormData" triggered', () => {
    createWrapper().props().onChangeFormData({feedTag: {name: 'expected tag'}})

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBSCRIPTION_EDIT_FORM_CHANGE_DATA',
      data: {feedTag: {name: 'expected tag'}}
    })
  })

  it('should dispatch expected action when prop function "onSaveFormData" triggered', () => {
    createWrapper().props().onSaveFormData({uuid: '1', feedTag: {name: 'expected tag'}})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PATCH_SUBSCRIPTION',
      url: '/myreader/api/2/subscriptions/1',
      body: {uuid: '1', feedTag: {name: 'expected tag'}}
    }))
  })

  it('should dispatch expected action when prop function "onRemoveSubscription" triggered', () => {
    createWrapper().props().onRemoveSubscription('1')

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_SUBSCRIPTION',
      url: '/myreader/api/2/subscriptions/1'
    }))
  })

  it('should dispatch expected action when prop function "onRemoveExclusionPattern" triggered', () => {
    createWrapper().props().onRemoveExclusionPattern('1', '10')

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS',
      url: '/myreader/api/2/exclusions/1/pattern/10'
    }))
  })

  it('should dispatch expected action when prop function "onAddExclusionPattern" triggered', () => {
    createWrapper().props().onAddExclusionPattern('1', 'tag')

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'POST_SUBSCRIPTION_EXCLUSION_PATTERN',
      url: '/myreader/api/2/exclusions/1/pattern',
      body: {
        pattern: 'tag'
      }
    }))
  })
})
