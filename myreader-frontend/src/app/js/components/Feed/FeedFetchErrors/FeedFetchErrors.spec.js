import React from 'react'
import {mount} from 'enzyme'
import FeedFetchErrors from './FeedFetchErrors'
import {IntersectionObserver} from '../../../components'

describe('FeedFetchErrors', () => {

  let props

  const createComponent = () => mount(<FeedFetchErrors {...props} />)

  beforeEach(() => {
    props = {
      loading: true,
      failures: [
        {uuid: '1', message: 'message 1', createdAt: 'createdAt 1'},
        {uuid: '2', message: 'message 2', createdAt: 'createdAt 2'}
      ],
      links: {
        next: {
          path: 'expected next'
        }
      },
      onMore: jest.fn()
    }
  })

  it('should render each item of prop "failures" in a wrapper node', () =>  {
    expect(createComponent().find('.my-feed-fetch-errors__item').length).toEqual(2)
  })

  it('should render intersection observer when prop "failures" has at least one item   and next link exists', () =>  {
    expect(createComponent().find(IntersectionObserver).exists()).toEqual(true)
  })

  it('should not render intersection observer when next link does not exist', () =>  {
    props.links = undefined

    expect(createComponent().find(IntersectionObserver).exists()).toEqual(false)
  })

  it('should not render intersection observer when prop "entries" is empty', () =>  {
    props.failures = []

    expect(createComponent().find(IntersectionObserver).exists()).toEqual(false)
  })

  it('should wrap last entry in intersection observer', () =>  {
    expect(createComponent().find(IntersectionObserver).find('[className="my-feed-fetch-errors__item"]').exists())
      .toEqual(true)
  })

  it('should render last entry without intersection observer when next link does not exists', () =>  {
    props.links = {}

    expect(createComponent().find(IntersectionObserver).find('[className="my-feed-fetch-errors__item"]').exists())
      .toEqual(false)
    expect(createComponent().find('.my-feed-fetch-errors__item').at(1).exists()).toEqual(true)
  })

  it('should trigger prop function "onMore" when intersection observer children becomes visible', () =>  {
    createComponent().find(IntersectionObserver).props().onIntersection()

    expect(props.onMore).toHaveBeenCalledWith(props.links.next)
  })

  it('should not render any entry wrapper node nor an intersection observer when prop "entries" is empty', () =>  {
    props.links = {}
    props.failures = []

    expect(createComponent().find(IntersectionObserver).exists()).toEqual(false)
    expect(createComponent().find('.my-feed-fetch-errors__item').children().length).toEqual(0)
  })

  it('should render load more button when next link exists', () =>  {
    expect(createComponent().find('.my-feed-fetch-errors__load-more').exists()).toEqual(true)
  })

  it('should not render load more button when next link does not exist', () =>  {
    props.links = {}

    expect(createComponent().find('.my-feed-fetch-errors__load-more').exists()).toEqual(false)
  })

  it('should pass expected props to button component', () =>  {
    const loadMoreButton = createComponent().find('[className="my-feed-fetch-errors__load-more"]')

    expect(loadMoreButton.prop('disabled')).toEqual(true)
  })

  it('should trigger prop function "onLoadMore" when button load more clicked', () =>  {
    createComponent().find('[className="my-feed-fetch-errors__load-more"]').props().onClick()

    expect(props.onMore).toHaveBeenCalledWith(props.links.next)
  })
})
