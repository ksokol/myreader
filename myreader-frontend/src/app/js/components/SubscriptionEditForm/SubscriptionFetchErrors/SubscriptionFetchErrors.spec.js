import React from 'react'
import {mount} from 'enzyme'
import {SubscriptionFetchErrors} from './SubscriptionFetchErrors'
import {subscriptionApi} from '../../../api'
import {flushPromises} from '../../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../../../api', () => ({
  subscriptionApi: {
    fetchFeedFetchErrors: jest.fn().mockResolvedValue({})
  }
}))

jest.mock('../../../components/IntersectionObserver/IntersectionObserver', () => ({children, ...props}) => {
  const IntersectionObserver = () => children
  return <IntersectionObserver {...props} />
})
/* eslint-enable */

describe('SubscriptionFetchErrors', () => {

  let mockResponse

  const createWrapper = async (response) => {
    subscriptionApi.fetchFeedFetchErrors.mockResolvedValueOnce(response)
    const wrapper = mount(<SubscriptionFetchErrors uuid='uuid1' />)
    await flushPromises()
    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    mockResponse =  [
      {uuid: '1', message: 'message 1', createdAt: 'createdAt 1'},
      {uuid: '2', message: 'message 2', createdAt: 'createdAt 2'}
    ]
  })

  it('should render each fetch error in a wrapper node', async () =>  {
    const wrapper = await createWrapper(mockResponse)

    expect(wrapper.find('.my-subscription-fetch-errors__item')).toHaveLength(2)
  })

  it('should trigger subscriptionApi.fetchFeedFetchErrors with prop "uuid"', async () =>  {
    await createWrapper(mockResponse)

    expect(subscriptionApi.fetchFeedFetchErrors).toHaveBeenCalledWith('uuid1')
  })
})
