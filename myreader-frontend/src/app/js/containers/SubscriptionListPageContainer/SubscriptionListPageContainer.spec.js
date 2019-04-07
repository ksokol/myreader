import React from 'react'
import {mount} from 'enzyme'
import SubscriptionListPageContainer from './SubscriptionListPageContainer'

/* eslint-disable react/prop-types */
jest.mock('../../pages', () => ({
  SubscriptionListPage: () => null
}))
/* eslint-enable */

describe('SubscriptionListPageContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<SubscriptionListPageContainer dispatch={dispatch} {...state} />).find('SubscriptionListPage')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      router: {
        query: {}
      },
      subscription: {
        subscriptions: [
          {uuid: '1', title: 'title1', createdAt: '2017-12-29'},
          {uuid: '2', title: 'title2', createdAt: '2017-11-30'}
        ]
      }
    }
  })

  it('should initialize component with given prop "subscriptions"', () => {
    expect(createWrapper().props()).toEqual(expect.objectContaining({
      subscriptions: [
        {uuid: '1', title: 'title1', createdAt: '2017-12-29'},
        {uuid: '2', title: 'title2', createdAt: '2017-11-30'}
      ]
    }))
  })

  it('should initialize component with given prop "subscriptions" filtered by prop "router.query.q"', () => {
    state.router.query.q = 'title2'

    expect(createWrapper().props()).toEqual(expect.objectContaining({
      subscriptions: [{uuid: '2', title: 'title2', createdAt: '2017-11-30'}]
    }))
  })
})
