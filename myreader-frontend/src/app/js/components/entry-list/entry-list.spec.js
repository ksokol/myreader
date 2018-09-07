import React from 'react'
import {shallow} from 'enzyme'
import EntryList from './entry-list'
import {EntryAutoFocus} from '../'
import {IntersectionObserver} from '../../shared/component/intersection-observer'
import {Button} from '../../shared/component/buttons'

describe('src/app/js/components/entry-list/entry-list.spec.js', () => {

  let props, itemProps, entries

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

    itemProps = {
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
      ...itemProps,
      loading: true,
      disabled: true,
      onLoadMore: jest.fn()
    }
  })

  const shallowRender = () => shallow(<EntryList {...props} />)

  it('should render each item of prop "entries" in a wrapper node', () =>  {
    expect(shallowRender().find('.my-entry-list > .my-entry-list__item').length).toEqual(2)
  })

  it('should set key on wrapper nodes', () =>  {
    const items = shallowRender().find('.my-entry-list > .my-entry-list__item')

    expect(items.at(0).key()).toEqual(props.entries[0].uuid)
    expect(items.at(1).key()).toEqual(props.entries[1].uuid)
  })

  it('should pass each item of prop "entries" to an entry auto focus component', () =>  {
    const items = shallowRender().find('.my-entry-list > .my-entry-list__item')

    expect(items.at(0).find(EntryAutoFocus).props()).toEqual({item: props.entries[0], ...itemProps})
    expect(items.at(1).find(EntryAutoFocus).props()).toEqual({item: props.entries[1], ...itemProps})
  })

  it('should trigger prop function "onChangeEntry" when entry in entry auto focus component changed', () =>  {
    shallowRender().find(EntryAutoFocus).at(0).props().onChangeEntry('expected change')

    expect(props.onChangeEntry).toHaveBeenCalledWith('expected change')
  })

  it('should render intersection observer when next link exists', () =>  {
    expect(shallowRender().find(IntersectionObserver).exists()).toEqual(true)
  })

  it('should not render intersection observer when next link does not exist', () =>  {
    props.links = {}

    expect(shallowRender().find(IntersectionObserver).exists()).toEqual(false)
  })

  it('should trigger prop function "onLoadMore" when intersection observer children becomes visible', () =>  {
    shallowRender().find(IntersectionObserver).props().onIntersection()

    expect(props.onLoadMore).toHaveBeenCalledWith(props.links.next)
  })

  it('should pass expected props to button component', () =>  {
    const loadMoreButton = shallowRender().find(IntersectionObserver).find(Button)

    expect(loadMoreButton.props()).toContainObject({
      disabled: props.disabled,
      className: 'my-button__load-more'
    })
  })

  it('should trigger prop function "onLoadMore" when button load more clicked', () =>  {
    shallowRender().find(IntersectionObserver).find(Button).props().onClick()

    expect(props.onLoadMore).toHaveBeenCalledWith(props.links.next)
  })
})
