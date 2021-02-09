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

const loadMoreButtonSelector = '[className="my-subscription-fetch-errors__load-more"]'
const errorItemsSelector = '.my-subscription-fetch-errors__item'
const expectedNextPath = 'expected next'

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
    mockResponse = {
      failures: [
        {uuid: '1', message: 'message 1', createdAt: 'createdAt 1'},
        {uuid: '2', message: 'message 2', createdAt: 'createdAt 2'}
      ],
      links: {
        next: {
          path: expectedNextPath
        }
      }
    }
  })

  it('should render each fetch error in a wrapper node', async () =>  {
    const wrapper = await createWrapper(mockResponse)

    expect(wrapper.find(errorItemsSelector)).toHaveLength(2)
  })

  it('should render intersection observer when fetch errors and next link exists', async () =>  {
    const wrapper = await createWrapper(mockResponse)

    expect(wrapper.find('IntersectionObserver').exists()).toEqual(true)
  })

  it('should not render intersection observer when next link does not exist', async () =>  {
    const wrapper = await createWrapper({...mockResponse, links: {}})

    expect(wrapper.find('IntersectionObserver').exists()).toEqual(false)
  })

  it('should not render intersection observer when fetch errors is empty', async () =>  {
    const wrapper = await createWrapper({...mockResponse, failures: []})

    expect(wrapper.find('IntersectionObserver').exists()).toEqual(false)
  })

  it('should wrap last fetch error in intersection observer', async () =>  {
    const wrapper = await createWrapper(mockResponse)

    expect(
      wrapper.find('IntersectionObserver').find('[className="my-subscription-fetch-errors__item"]').exists()
    ).toEqual(true)
  })

  it('should render last fetch error without intersection observer when next link does not exists', async () =>  {
    const wrapper = await createWrapper({...mockResponse, links: {}})

    expect(
      wrapper.find('IntersectionObserver').find('[className="my-subscription-fetch-errors__item"]').exists()
    ).toEqual(false)
    expect(
      wrapper.find(errorItemsSelector).at(1).exists()
    ).toEqual(true)
  })

  it('should trigger subscriptionApi.fetchFeedFetchErrors when intersection observer last fetch error becomes visible', async () =>  {
    const wrapper = await createWrapper(mockResponse)
    wrapper.find('IntersectionObserver').props().onIntersection()

    expect(subscriptionApi.fetchFeedFetchErrors).toHaveBeenCalledWith({path: expectedNextPath})
  })

  it('should not render any fetch error wrapper node nor an intersection observer when prop fetch errors is empty', async () =>  {
    const wrapper = await createWrapper({content: [], links: {}})

    expect(wrapper.find('IntersectionObserver').exists()).toEqual(false)
    expect(wrapper.find(errorItemsSelector).children()).toHaveLength(0)
  })

  it('should render load more button when next link exists', async () =>  {
    const wrapper = await createWrapper(mockResponse)

    expect(wrapper.find('.my-subscription-fetch-errors__load-more').exists()).toEqual(true)
  })

  it('should not render load more button when next link does not exist', async () =>  {
    const wrapper = await createWrapper({...mockResponse, links: {}})

    expect(wrapper.find('.my-subscription-fetch-errors__load-more').exists()).toEqual(false)
  })

  it('should disable button when error fetching is pending', async () =>  {
    const wrapper = await createWrapper(mockResponse)
    wrapper.find('IntersectionObserver').props().onIntersection()
    wrapper.update()
    const loadMoreButton = wrapper.find(loadMoreButtonSelector)

    expect(loadMoreButton.prop('disabled')).toEqual(true)
  })

  it('should enable button when error fetching succeeded', async () =>  {
    const wrapper = await createWrapper(mockResponse)
    const loadMoreButton = wrapper.find(loadMoreButtonSelector)

    expect(loadMoreButton.prop('disabled')).toEqual(false)
  })

  it('should trigger subscriptionApi.fetchFeedFetchErrors when button load more clicked', async () =>  {
    const wrapper = await createWrapper(mockResponse)
    wrapper.find(loadMoreButtonSelector).props().onClick()

    expect(subscriptionApi.fetchFeedFetchErrors).toHaveBeenCalledWith({path: expectedNextPath})
  })

  it('should trigger subscriptionApi.fetchFeedFetchErrors with prop "uuid"', async () =>  {
    await createWrapper(mockResponse)

    expect(subscriptionApi.fetchFeedFetchErrors).toHaveBeenCalledWith('uuid1')
  })

  it('should only trigger subscriptionApi.fetchFeedFetchErrors only once', async () =>  {
    const wrapper = await createWrapper(mockResponse)

    subscriptionApi.fetchFeedFetchErrors.mockClear()
    wrapper.find('IntersectionObserver').props().onIntersection()
    wrapper.update()
    wrapper.find('IntersectionObserver').props().onIntersection()
    wrapper.update()

    expect(subscriptionApi.fetchFeedFetchErrors).toHaveBeenCalledTimes(1)
  })
})
