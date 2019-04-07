import React from 'react'
import {mount} from 'enzyme'
import FeedListPageContainer from './FeedListPageContainer'

/* eslint-disable react/prop-types */
jest.mock('../../pages', () => ({
  FeedListPage: () => null
}))
/* eslint-enable */

describe('FeedListPageContainer', () => {

  let state

  const createWrapper = () => {
    return mount(<FeedListPageContainer {...state} />).find('FeedListPage')
  }

  beforeEach(() => {
    state = {
      router: {
        query: {}
      },
      admin: {
        feeds: [
          {uuid: '1', title: 'title1', hasErrors: false, createdAt: '2017-12-29'},
          {uuid: '2', title: 'title2', hasErrors: true, createdAt: '2017-11-30'}
        ]
      }
    }
  })

  it('should initialize component with given prop "feed"', () => {
    expect(createWrapper().props()).toEqual({
      feeds: [
        {uuid: '1', title: 'title1', hasErrors: false, createdAt: '2017-12-29'},
        {uuid: '2', title: 'title2', hasErrors: true, createdAt: '2017-11-30'}
      ],
    })
  })

  it('should initialize component with given prop "feeds" filtered by prop "router.query.q"', () => {
    state.router.query.q = 'title2'

    expect(createWrapper().props()).toEqual({
      feeds: [{uuid: '2', title: 'title2', hasErrors: true, createdAt: '2017-11-30'}],
    })
  })
})
