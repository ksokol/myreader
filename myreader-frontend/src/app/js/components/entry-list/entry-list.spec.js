import React from 'react'
import {shallow} from 'enzyme'
import EntryList from './entry-list'
import {EntryAutoFocus} from '../'
import {IntersectionObserver} from '../../shared/component/intersection-observer'

describe('src/app/js/components/entry-list/entry-list.spec.js', () => {

  let props, commonProps, entries

  beforeEach(() => {
    entries = [{
      uuid: 'expected uuid',
      title: 'expected title',
      feedTitle: 'expected feedTitle',
      tag: 'expected tag',
      origin: 'expected origin',
      seen: false,
      createdAt: 'expected createdAt',
      content: 'expected content'
    }, {
      uuid: 'expected uuid1',
      title: 'expected title',
      feedTitle: 'expected feedTitle',
      tag: 'expected tag',
      origin: 'expected origin',
      seen: true,
      createdAt: 'expected createdAt',
      content: 'expected content'
    }]

    commonProps = {
      isDesktop: true,
      showEntryDetails: true,
      focusUuid: '2',
      onChangeEntry: jest.fn(),
    }

    props = {
      links: {
        next: 'expected next link'
      },
      entries,
      ...commonProps,
      loading: true,
      disabled: true,
      onLoadMore: jest.fn()
    }
  })

  const shallowRender = () => shallow(<EntryList {...props} />)

  it('should render each item of prop "entries" in a wrapper node', () =>  {
    expect(shallowRender().find('.my-entry-list__item').length).toEqual(2)
  })

  it('should set key on wrapper nodes', () =>  {
    const items = shallowRender().find('.my-entry-list__item')

    expect(items.at(0).key()).toEqual(props.entries[0].uuid)
    expect(items.at(1).key()).toEqual(props.entries[1].uuid)
  })

  it('should pass each item of prop "entries" to an entry auto focus component', () =>  {
    const items = shallowRender().find('.my-entry-list__item')

    expect(items.at(0).find(EntryAutoFocus).props()).toEqual({item: props.entries[0], ...commonProps})
    expect(items.at(1).find(EntryAutoFocus).props()).toEqual({item: props.entries[1], ...commonProps})
  })

  it('should trigger prop function "onChangeEntry" when entry in entry auto focus component changed', () =>  {
    shallowRender().find(EntryAutoFocus).at(0).props().onChangeEntry('expected change')

    expect(props.onChangeEntry).toHaveBeenCalledWith('expected change')
  })

  it('should render intersection observer when at least one entry and next link exists', () =>  {
    expect(shallowRender().find(IntersectionObserver).exists()).toEqual(true)
  })

  it('should not render intersection observer when next link does not exist', () =>  {
    props.links = {}

    expect(shallowRender().find(IntersectionObserver).exists()).toEqual(false)
  })

  it('should not render intersection observer when prop "entries" is empty', () =>  {
    props.entries = []

    expect(shallowRender().find(IntersectionObserver).exists()).toEqual(false)
  })

  it('should wrap last entry in intersection observer', () =>  {
    expect(shallowRender().find(IntersectionObserver).find(EntryAutoFocus).props()).toEqual({item: props.entries[1], ...commonProps})
  })

  it('should render last entry without intersection observer when next link does not exists', () =>  {
    props.links = {}

    expect(shallowRender().find(IntersectionObserver).exists()).toEqual(false)
    expect(shallowRender().find('.my-entry-list__item').at(1).find(EntryAutoFocus).props()).toEqual({item: props.entries[1], ...commonProps})
  })

  it('should trigger prop function "onLoadMore" when intersection observer children becomes visible', () =>  {
    shallowRender().find(IntersectionObserver).props().onIntersection()

    expect(props.onLoadMore).toHaveBeenCalledWith(props.links.next)
  })

  it('should not render any entry wrapper node nor an intersection observer when prop "entries" is empty', () =>  {
    props.links = {}
    props.entries = []

    expect(shallowRender().find(IntersectionObserver).exists()).toEqual(false)
    expect(shallowRender().find('.my-entry').children().length).toEqual(0)
  })

  it('should render load more button when next link exists', () =>  {
    expect(shallowRender().find('.my-button__load-more').exists()).toEqual(true)
  })

  it('should not render load more button when next link does not exist', () =>  {
    props.links = {}

    expect(shallowRender().find('.my-button__load-more').exists()).toEqual(false)
  })

  it('should pass expected props to button component', () =>  {
    const loadMoreButton = shallowRender().find('.my-button__load-more')

    expect(loadMoreButton.props()).toContainObject({
      disabled: props.disabled
    })
  })

  it('should trigger prop function "onLoadMore" when button load more clicked', () =>  {
    shallowRender().find('.my-button__load-more').props().onClick()

    expect(props.onLoadMore).toHaveBeenCalledWith(props.links.next)
  })
})
