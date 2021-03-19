import React from 'react'
import {shallow} from 'enzyme'
import {EntryList} from './EntryList'

const listItemSelector = '.my-entry-list__item'

describe('EntryList', () => {

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
      entryInFocusUuid: '2',
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

  const createWrapper = () => shallow(<EntryList {...props} />)

  it('should pass each item of prop "entries" to an entry auto focus component', () =>  {
    const items = createWrapper().find(listItemSelector)

    expect(items.at(0).find('EntryAutoFocus').props()).toEqual({
      item: props.entries[0],
      onChangeEntry: commonProps.onChangeEntry,
      focusUuid: '2'
    })

    expect(items.at(1).find('EntryAutoFocus').props()).toEqual({
      item: props.entries[1],
      onChangeEntry: commonProps.onChangeEntry,
      focusUuid: '2'
    })
  })

  it('should trigger prop function "onChangeEntry" when entry in entry auto focus component changed', () =>  {
    createWrapper().find('EntryAutoFocus').at(0).props().onChangeEntry('expected change')

    expect(props.onChangeEntry).toHaveBeenCalledWith('expected change')
  })

  it('should render intersection observer when at least one entry and next link exists', () =>  {
    expect(createWrapper().find('IntersectionObserver').exists()).toEqual(true)
  })

  it('should not render intersection observer when next link does not exist', () =>  {
    props.links = {}

    expect(createWrapper().find('IntersectionObserver').exists()).toEqual(false)
  })

  it('should not render intersection observer when prop "entries" is empty', () =>  {
    props.entries = []

    expect(createWrapper().find('IntersectionObserver').exists()).toEqual(false)
  })

  it('should wrap last entry in intersection observer', () =>  {
    expect(createWrapper().find('IntersectionObserver').find('EntryAutoFocus').props()).toEqual({
      item: props.entries[1],
      onChangeEntry: commonProps.onChangeEntry,
      focusUuid: '2'
    })
  })

  it('should render last entry without intersection observer when next link does not exists', () =>  {
    props.links = {}

    expect(createWrapper().find('IntersectionObserver').exists()).toEqual(false)
    expect(createWrapper().find(listItemSelector).at(1).find('EntryAutoFocus').props()).toEqual({
      item: props.entries[1],
      onChangeEntry: commonProps.onChangeEntry,
      focusUuid: '2',
    })
  })

  it('should set prop "focusUuid" to undefined when no entry is in focus', () =>  {
    delete props.entryInFocusUuid
    const items = createWrapper().find(listItemSelector)

    expect(items.at(0).find('EntryAutoFocus').props()).toEqual(expect.objectContaining({
      focusUuid: undefined
    }))

    expect(items.at(1).find('EntryAutoFocus').props()).toEqual(expect.objectContaining({
      focusUuid: undefined
    }))
  })

  it('should trigger prop function "onLoadMore" when intersection observer children becomes visible', () =>  {
    createWrapper().find('IntersectionObserver').props().onIntersection()

    expect(props.onLoadMore).toHaveBeenCalledWith(props.links.next)
  })

  it('should not render any entry wrapper node nor an intersection observer when prop "entries" is empty', () =>  {
    props.links = {}
    props.entries = []

    expect(createWrapper().find('IntersectionObserver').exists()).toEqual(false)
    expect(createWrapper().find('.my-entry').children()).toHaveLength(0)
  })
})
