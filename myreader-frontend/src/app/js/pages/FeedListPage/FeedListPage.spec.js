import React from 'react'
import {mount} from 'enzyme'
import {FeedListPage} from './FeedListPage'
import {feedApi} from '../../api'
import {toast} from '../../components/Toast'
import {flushPromises, rejected, resolved} from '../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  FeedList: () => null,
  ListLayout: ({listPanel}) => <div>{listPanel}</div>
}))

jest.mock('../../contexts', () => ({
  withNotification: Component => Component
}))

jest.mock('../../api', () => ({
  feedApi: {}
}))

jest.mock('../../components/Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

describe('FeedListPage', () => {

  const createWrapper = () => mount(<FeedListPage />)

  it('should pass feeds to feed list component when feedApi.fetchFeeds succeeded', async () => {
    feedApi.fetchFeeds = resolved([
      {title: 'title1'},
      {title: 'title2'}
    ])
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('FeedList').props()).toEqual({
      feeds: [
        {title: 'title1'},
        {title: 'title2'}
      ]
    })
  })

  it('should trigger toast when feedApi.fetchFeeds failed', async () => {
    feedApi.fetchFeeds = rejected('some error')
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith('some error', {error: true})
  })

  it('should call feedApi.fetchFeeds when mounted', () => {
    createWrapper()

    expect(feedApi.fetchFeeds).toHaveBeenCalled()
  })
})
