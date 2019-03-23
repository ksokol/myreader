import React from 'react'
import {shallow} from 'enzyme'
import BookmarkListPage from './BookmarkListPage'

describe('BookmarkListPage', () => {

  let props

  const createComponent = () => shallow(<BookmarkListPage {...props} />)

  beforeEach(() => {
    props = {
      router: {
        query: {
          a: 'b',
          entryTagEqual: 'expected tag'
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
      entryTags: ['tag1', 'tag2'],
      loading: true,
      isDesktop: true,
      showEntryDetails: true,
      onSearchChange: jest.fn(),
      onChangeEntry: jest.fn(),
      onRefresh: jest.fn(),
      onLoadMore: jest.fn(),
    }
  })

  it('should pass expected props', () => {
    expect(createComponent().first().props()).toContainObject({
      onSearchChange: props.onSearchChange
    })
  })

  it('should trigger prop function "onRefresh"', () => {
    createComponent().first().props().onRefresh()

    expect(props.onRefresh).toHaveBeenCalledWith({a: 'b', entryTagEqual: 'expected tag'})
  })

  it('should pass expected props to prop render function "listPanel"', () => {
    expect(createComponent().first().prop('listPanel').props.children[0].props).toContainObject({
      values: ['tag1', 'tag2'],
      selected: 'expected tag'
    })
    expect(createComponent().first().prop('listPanel').props.children[1].props).toContainObject({
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
      isDesktop: true,
      loading: true,
      showEntryDetails: true,
      onChangeEntry: props.onChangeEntry,
      onLoadMore: props.onLoadMore
    })
  })

  it('should trigger prop function "onSearchChange"', () => {
    createComponent().first().prop('listPanel').props.children[0].props.onSelect('expected tag')

    expect(props.onSearchChange).toHaveBeenCalledWith({a: 'b', entryTagEqual: 'expected tag'})
  })
})
