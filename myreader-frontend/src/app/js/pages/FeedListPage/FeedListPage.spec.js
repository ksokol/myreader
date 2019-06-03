import React from 'react'
import {mount} from 'enzyme'
import FeedListPage from './FeedListPage'
import {feedApi} from '../../api'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  FeedList: () => null,
  ListLayout: ({listPanel}) => <div>{listPanel}</div>
}))

jest.mock('../../contexts', () => ({
  withNotification: Component => Component
}))

jest.mock('../../api', () => ({
  feedApi: {
    fetchFeeds: jest.fn().mockResolvedValue([])
  }
}))
/* eslint-enable */

jest.useRealTimers()

describe('FeedListPage', () => {

  let props

  const createWrapper = () => mount(<FeedListPage {...props} />)

  beforeEach(() => {
    props = {
      showErrorNotification: jest.fn()
    }
  })

  it('should pass feeds to feed list component when feedApi.fetchFeeds succeeded', done => {
    feedApi.fetchFeeds.mockResolvedValue([
      {title: 'title1'},
      {title: 'title2'}
    ])
    const wrapper = createWrapper()

    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('FeedList').props()).toEqual({
        feeds: [
          {title: 'title1'},
          {title: 'title2'}
        ]
      })
      done()
    })
  })

  it('should trigger prop function "showErrorNotification" when feedApi.fetchFeeds failed', done => {
    feedApi.fetchFeeds.mockRejectedValueOnce('some error')
    const wrapper = createWrapper()

    setTimeout(() => {
      wrapper.update()
      expect(props.showErrorNotification).toHaveBeenCalledWith('some error')
      done()
    })
  })

  it('should call feedApi.fetchFeeds when mounted', () => {
    createWrapper()

    expect(feedApi.fetchFeeds).toHaveBeenCalled()
  })
})
