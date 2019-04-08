import React from 'react'
import {mount} from 'enzyme'
import FeedListPage from './FeedListPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  FeedList: () => null,
  ListLayout: ({listPanel}) => <div>{listPanel}</div>
}))
/* eslint-enable */

describe('FeedListPage', () => {

  let state, dispatch

  const createWrapper = () => mount(<FeedListPage dispatch={dispatch} state={state} />)

  beforeEach(() => {
    dispatch= jest.fn()

    state = {
      router: {
        query: {}
      },
      admin: {
        feeds: [
          {title: 'title1'},
          {title: 'title2'}
        ]
      }
    }
  })

  it('should initialize component with given prop "feed"', () => {
    expect(createWrapper().find('FeedList').props()).toEqual({
      feeds: [
        {title: 'title1'},
        {title: 'title2'}
      ]
    })
  })

  it('should initialize component with given prop "feeds" filtered by prop "router.query.q"', () => {
    state.router.query.q = 'title2'

    expect(createWrapper().find('FeedList').props()).toEqual({
      feeds: [{title: 'title2'}]
    })
  })

  it('should dispatch action GET_FEEDS when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_FEEDS',
      url: 'api/2/feeds'
    }))
  })
})
