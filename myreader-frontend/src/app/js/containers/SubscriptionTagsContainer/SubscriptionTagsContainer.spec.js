import React from 'react'
import {mount} from 'enzyme'
import SubscriptionTagsContainer from './SubscriptionTagsContainer'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  SubscriptionTags: () => null
}))
/* eslint-enable */

describe('SubscriptionTagsContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<SubscriptionTagsContainer dispatch={dispatch} state={state} />).find('SubscriptionTags')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      subscription: {
        subscriptions: [
          {feedTag: {uuid: 'uuid1', name: 'name1', color: 'color1'}},
          {feedTag: {uuid: 'uuid2', name: 'name2', color: null}}
        ]
      }
    }
  })

  it('should initialize component with given props', () => {
    expect(createWrapper().prop('subscriptionTags')).toEqual([
      {uuid: 'uuid1', name: 'name1', color: 'color1'},
      {uuid: 'uuid2', name: 'name2', color: null}
    ])
  })

  it('should dispatch action when prop function "onChange" triggered', () => {
    createWrapper().props().onChange({uuid: 'uuid1', name: 'name1', color: 'expected color'})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PATCH_SUBSCRIPTION_TAG',
      url: 'api/2/subscriptionTags/uuid1',
      body: {
        uuid: 'uuid1',
        name: 'name1',
        color: 'expected color'
      }
    }))
  })
})
