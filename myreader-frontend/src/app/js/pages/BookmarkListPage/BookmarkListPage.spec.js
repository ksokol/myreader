import React from 'react'
import {mount} from 'enzyme'
import BookmarkListPage from './BookmarkListPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  EntryList: () => null,
  Chips: () => null,
  ListLayout: ({listPanel}) => <div>{listPanel}</div>
}))
/* eslint-enable */

describe('BookmarkListPage', () => {

  let props, state, dispatch

  const createWrapper = () => mount(<BookmarkListPage {...props} state={state} dispatch={dispatch} />)

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
    })

    state = {
      settings: {
        showEntryDetails: true
      },
      common: {
        mediaBreakpoint: 'desktop'
      },
      entry: {
        entries: ['expected entries'],
        links: {next: {path: 'expected-path', query: {size: '2'}}},
        tags: ['tag1', 'tag2'],
        loading: true
      }
    }

    props = {
      location: {
        search: '?entryTagEqual=expected tag'
      },
      match: {
        params: {}
      },
      history: {
        push: jest.fn()
      }
    }
  })

  it('should pass expected props to chips component', () => {
    expect(createWrapper().find('Chips').props()).toContainObject({
      values: ['tag1', 'tag2'],
      selected: 'expected tag'
    })
  })

  it('should pass expected props to entry list component', () => {
    expect(createWrapper().find('EntryList').props()).toEqual(expect.objectContaining({
      entries: ['expected entries'],
      links: {next: {path: 'expected-path', query: {size: '2'}}},
      isDesktop: true,
      loading: true,
      showEntryDetails: true
    }))
  })

  it('should dispatch action PATCH_ENTRY when prop function "onChangeEntry" of entry list component triggered', () => {
    createWrapper().find('EntryList').props().onChangeEntry({uuid: '1', seen: true, tag: 'expected tag'})

    expect(dispatch).toHaveBeenNthCalledWith(5, expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: 'api/2/subscriptionEntries/1',
      body: {
        seen: true,
        tag: 'expected tag'
      }
    }))
  })

  it('should dispatch action GET_ENTRIES when prop function "onLoadMore" of entry list component triggered', () => {
    createWrapper().find('EntryList').props().onLoadMore({...state.entry.links.next})

    expect(dispatch).toHaveBeenNthCalledWith(5, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'expected-path?seenEqual=*&size=2'
    }))
  })

  it('should trigger prop function "history.push"', () => {
    createWrapper().find('Chips').props().onSelect('expected tag')

    expect(props.history.push).toHaveBeenCalledWith({
      query: {entryTagEqual: 'expected tag'},
      search: '?entryTagEqual=expected tag',
      state: {}
    })
  })

  it('should dispatch action GET_ENTRY_TAGS when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
      type: 'GET_ENTRY_TAGS',
      url: 'api/2/subscriptionEntries/availableTags'
    }))
  })

  it('should dispatch action GET_ENTRIES when mounted', () => {
    props.match.params = {entryTagEqual: 'expected entryTagEqual'}
    props.location.search = 'size=5&q=expectedQ'

    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?q=expectedQ&size=5&entryTagEqual=expected entryTagEqual&seenEqual=*'
    }))
  })

  it('should dispatch action GET_ENTRIES when search query parameter "q" changed', () => {
    const wrapper = createWrapper()
    wrapper.setProps({location: {search: 'q=changedQ'}})


    expect(dispatch).toHaveBeenNthCalledWith(5, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?q=changedQ&seenEqual=*'
    }))
  })

  it('should not dispatch action GET_ENTRIES when search query parameter "q" stays the same', () => {
    props.match.params = {entryTagEqual: 'expected entryTagEqual'}
    props.location.search = 'q=expectedQ'

    const wrapper = createWrapper()
    wrapper.setProps({match: {params: {entryTagEqual: 'changed entryTagEqual'}}})

    expect(dispatch.mock.calls.length).toEqual(3)
  })
})
