import React from 'react'
import {mount} from 'enzyme'
import EntryStreamPage from './EntryStreamPage'
import {EntryList, Hotkeys} from '..'

describe('EntryStreamPage', () => {

  let props

  const createComponent = () => mount(<EntryStreamPage {...props} />)

  beforeEach(() => {
    props = {
      router: {
        query: {
          a: 'b'
        }
      },
      links: {
        next: {
          path: 'expected-path',
          query: {}
        }
      },
      entries: [
        {
          uuid: '1',
          title: 'title 1',
          feedTitle: 'feedTitle 1',
          origin: 'origin 1',
          seen: true,
          createdAt: 'createdAt 1'
        },
        {
          uuid: '2',
          title: 'title 2',
          feedTitle: 'feedTitle 2',
          origin: 'origin 2',
          seen: false,
          createdAt: 'createdAt 2'
        }
      ],
      entryInFocus: {
        uuid: '1',
        seen: true
      },
      nextFocusableEntry: {
        uuid: '2',
        title: 'title 2',
        feedTitle: 'feedTitle 2',
        origin: 'origin 2',
        seen: false,
        createdAt: 'createdAt 2'
      },
      showEntryDetails: true,
      loading: true,
      isDesktop: true,
      onSearchChange: jest.fn(),
      onRefresh: jest.fn(),
      onChangeEntry: jest.fn(),
      onLoadMore: jest.fn(),
      previousEntry: jest.fn(),
      entryFocusNext: jest.fn()
    }
  })

  it('should pass expected props', () => {
    expect(createComponent().props()).toContainObject({
      router: {query: {a: 'b'}},
      onSearchChange: props.onSearchChange
    })
  })

  it('should not render next and previous buttons when prop "isDesktop" is set to false', () => {
    props.isDesktop = false

    expect(createComponent().find('IconButton[type="chevron-left"]').exists()).toEqual(false)
    expect(createComponent().find('IconButton[type="chevron-right"]').exists()).toEqual(false)
  })

  it('should render next and previous buttons when prop "isDesktop" is set to true', () => {
    expect(createComponent().find('IconButton[type="chevron-left"]').exists()).toEqual(true)
    expect(createComponent().find('IconButton[type="chevron-right"]').exists()).toEqual(true)
  })

  it('should trigger prop function "previousEntry" when previous button clicked', () => {
    createComponent().find('IconButton[type="chevron-left"]').props().onClick()

    expect(props.previousEntry).toHaveBeenCalled()
  })

  it('should only trigger prop function "entryFocusNext" when next button clicked and entry seen flag is set to true', () => {
    props.nextFocusableEntry.seen = true
    createComponent().find('IconButton[type="chevron-right"]').props().onClick()

    expect(props.entryFocusNext).toHaveBeenCalled()
    expect(props.onChangeEntry).not.toHaveBeenCalled()
  })

  it('should trigger prop function "entryFocusNext" and "onChangeEntry" when next button clicked and entry seen flag is set to false', () => {
    createComponent().find('IconButton[type="chevron-right"]').props().onClick()

    expect(props.entryFocusNext).toHaveBeenCalled()
    expect(props.onChangeEntry).toHaveBeenCalledWith({
      uuid: '2',
      title: 'title 2',
      feedTitle: 'feedTitle 2',
      origin: 'origin 2',
      seen: true,
      createdAt: 'createdAt 2'
    })
  })

  it('should trigger prop function "onRefresh" when refresh button clicked', () => {
    createComponent().find('IconButton[type="redo"]').props().onClick()

    expect(props.onRefresh).toHaveBeenCalledWith({a: 'b'})
  })

  it('should pass expected props to entry list component', () => {
    expect(createComponent().find(EntryList).props()).toContainObject({
      entries: [
        {
          uuid: '1',
          title: 'title 1',
          feedTitle: 'feedTitle 1',
          origin: 'origin 1',
          seen: true,
          createdAt: 'createdAt 1'
        },
        {
          uuid: '2',
          title: 'title 2',
          feedTitle: 'feedTitle 2',
          origin: 'origin 2',
          seen: false,
          createdAt: 'createdAt 2'
        }
      ],
      links: {
        next: {
          path: 'expected-path',
          query: {}
        }
      },
      entryInFocus: {
        uuid: '1'
      },
      isDesktop: true,
      loading: true,
      showEntryDetails: true
    })
  })

  it('should trigger prop function "onChangeEntry" when entry changed', () => {
    createComponent().find(EntryList).props().onChangeEntry({uuid: '2', a: 'b'})

    expect(props.onChangeEntry).toHaveBeenCalledWith({uuid: '2', a: 'b'})
  })

  it('should trigger prop function "onLoadMore" when load more button clicked', () => {
    createComponent().find(EntryList).props().onLoadMore()

    expect(props.onLoadMore).toHaveBeenCalled()
  })

  it('should trigger prop function "previousEntry" when arrow up key pressed', () => {
    createComponent().find(Hotkeys).prop('onKeys').up()

    expect(props.previousEntry).toHaveBeenCalled()
  })

  it('should only trigger prop function "entryFocusNext" when arrow down key pressed and entry seen flag is set to true', () => {
    props.nextFocusableEntry.seen = true
    createComponent().find(Hotkeys).prop('onKeys').down()

    expect(props.entryFocusNext).toHaveBeenCalled()
    expect(props.onChangeEntry).not.toHaveBeenCalled()
  })

  it('should trigger prop function "entryFocusNext" and "onChangeEntry" when next arrow down key pressed and entry seen flag is set to false', () => {
    createComponent().find(Hotkeys).prop('onKeys').down()

    expect(props.entryFocusNext).toHaveBeenCalled()
    expect(props.onChangeEntry).toHaveBeenCalledWith({
      uuid: '2',
      title: 'title 2',
      feedTitle: 'feedTitle 2',
      origin: 'origin 2',
      seen: true,
      createdAt: 'createdAt 2'
    })
  })

  it('should trigger prop function "onChangeEntry" when esc pressed', () => {
    createComponent().find(Hotkeys).prop('onKeys').esc()

    expect(props.onChangeEntry).toHaveBeenCalledWith({uuid: '1', seen: false})
  })
})
