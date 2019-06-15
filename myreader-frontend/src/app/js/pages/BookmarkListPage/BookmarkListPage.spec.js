import React from 'react'
import {mount} from 'enzyme'
import BookmarkListPage from './BookmarkListPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  EntryList: () => null,
  Chips: () => null,
  ListLayout: ({listPanel}) => <div>{listPanel}</div>
}))

jest.mock('../../contexts', () => ({
  withLocationState: Component => Component
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
      searchParams: {
        entryTagEqual: 'expected tag'
      },
      historyReplace: jest.fn(),
      locationChanged: false,
      locationReload: false
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
      loading: true
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

  it('should return expected prop from Chips prop function "renderItem"', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('Chips').props().renderItem('tag').props).toEqual(expect.objectContaining({
      to: {
        pathname: '/app/bookmark',
        search: '?entryTagEqual=tag'
      }
    }))
  })

  it('should dispatch action GET_ENTRY_TAGS when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
      type: 'GET_ENTRY_TAGS',
      url: 'api/2/subscriptionEntries/availableTags'
    }))
  })

  it('should dispatch action GET_ENTRIES when mounted', () => {
    props.searchParams = {
      entryTagEqual: 'expected entryTagEqual',
      size: '5',
      q: 'expectedQ'
    }

    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?q=expectedQ&size=5&entryTagEqual=expected entryTagEqual&seenEqual=*'
    }))
  })

  it('should dispatch action GET_ENTRIES when prop "locationReload" is set to true', () => {
    const wrapper = createWrapper()
    dispatch.mockClear()
    wrapper.setProps({locationReload: true})


    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?entryTagEqual=expected tag&seenEqual=*'
    }))
  })

  it('should dispatch action GET_ENTRIES when prop "locationChanged" is set to true', () => {
    const wrapper = createWrapper()
    dispatch.mockClear()
    wrapper.setProps({locationChanged: true})

    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?entryTagEqual=expected tag&seenEqual=*'
    }))
  })
})
