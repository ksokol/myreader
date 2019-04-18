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

  let state, dispatch, props

  const createWrapper = () => mount(<FeedListPage {...props} dispatch={dispatch} state={state} />)

  beforeEach(() => {
    dispatch= jest.fn()

    state = {
      admin: {
        feeds: [
          {title: 'title1'},
          {title: 'title2'}
        ]
      }
    }

    props = {
      location: {
        search: ''
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

  it('should initialize component with given prop "feeds" filtered by prop "props.location.search"', () => {
    props.location.search = 'q=title2'

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
