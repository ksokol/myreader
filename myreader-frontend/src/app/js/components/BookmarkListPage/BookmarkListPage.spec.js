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
      entryTags: ['tag1', 'tag2'],
      onSearchChange: jest.fn(),
      onRefresh: jest.fn()
    }
  })

  it('should pass expected props', () => {
    expect(createComponent().first().props()).toContainObject({
      router: {query: {a: 'b', entryTagEqual: 'expected tag'}},
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
  })

  it('should trigger prop function "onSearchChange"', () => {
    createComponent().first().prop('listPanel').props.children[0].props.onSelect('expected tag')

    expect(props.onSearchChange).toHaveBeenCalledWith({a: 'b', entryTagEqual: 'expected tag'})
  })
})
