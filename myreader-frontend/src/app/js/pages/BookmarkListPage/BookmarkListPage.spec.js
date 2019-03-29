import React from 'react'
import {mount} from 'enzyme'
import BookmarkListPage from './BookmarkListPage'

jest.mock('react-router-dom', () => ({
  withRouter: WrappedComponent => WrappedComponent,
}))

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  EntryList: () => null,
  Chips: () => null,
  ListLayout: ({listPanel}) => <div>{listPanel}</div>
}))
/* eslint-enable */

describe('BookmarkListPage', () => {

  let props

  const createComponent = () => mount(<BookmarkListPage {...props} />)

  beforeEach(() => {
    props = {
      links: {expected: 'links'},
      entries: ['expected entries'],
      entryTags: ['tag1', 'tag2'],
      loading: true,
      isDesktop: true,
      showEntryDetails: true,
      onChangeEntry: jest.fn(),
      onLoadMore: jest.fn(),
      location: {
        search: '?entryTagEqual=expected tag'
      },
      history: {
        push: jest.fn()
      }
    }
  })

  it('should pass expected props to chips component', () => {
    expect(createComponent().find('Chips').props()).toContainObject({
      values: ['tag1', 'tag2'],
      selected: 'expected tag'
    })
  })

  it('should pass expected props to entry list component', () => {
    expect(createComponent().find('EntryList').props()).toContainObject({
      entries: ['expected entries'],
      links: {expected: 'links'},
      isDesktop: true,
      loading: true,
      showEntryDetails: true,
      onChangeEntry: props.onChangeEntry,
      onLoadMore: props.onLoadMore
    })
  })

  it('should trigger prop function "history.push"', () => {
    createComponent().find('Chips').props().onSelect('expected tag')

    expect(props.history.push).toHaveBeenCalledWith({
      query: {entryTagEqual: 'expected tag'},
      search: '?entryTagEqual=expected tag',
      state: {}
    })
  })
})
