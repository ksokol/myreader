import React from 'react'
import {mount} from 'enzyme'
import EntryStreamPage from './EntryStreamPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  EntryList: ({children}) => <div>{children}</div>,
  Hotkeys: ({children}) => <div>{children}</div>,
  IconButton: ({children}) => <div>{children}</div>,
  ListLayout: ({actionPanel, listPanel}) => <div>{actionPanel}{listPanel}</div>
}))
/* eslint-enable */

describe('EntryStreamPage', () => {

  let state, dispatch, props

  const createWrapper = () => mount(<EntryStreamPage {...props} dispatch={dispatch} state={state} />)

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
    })

    state = {
      common: {
        mediaBreakpoint: 'desktop'
      },
      settings: {
        showEntryDetails: true
      },
      entry: {
        links: {
          next: {
            query: {a: 'b'}
          }
        },
        entries: [
          {uuid: '1', seen: true, tag: 'tag1'},
          {uuid: '2', seen: false, tag: 'tag2'}
        ],
        entryInFocus: '1',
        loading: true
      }
    }

    props = {
      location: {
        search: '?q=expectedQ'
      }
    }
  })

  it('should not render next and previous buttons when media breakpoint is not desktop', () => {
    state.common.mediaBreakpoint = 'phone'
    const wrapper = createWrapper()

    expect(wrapper.find('IconButton[type="chevron-left"]').exists()).toEqual(false)
    expect(wrapper.find('IconButton[type="chevron-right"]').exists()).toEqual(false)
  })

  it('should render next and previous buttons when media breakpoint is desktop', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('IconButton[type="chevron-left"]').exists()).toEqual(true)
    expect(wrapper.find('IconButton[type="chevron-right"]').exists()).toEqual(true)
  })

  it('should trigger prop function "previousEntry" when previous button clicked', () => {
    createWrapper().find('IconButton[type="chevron-left"]').props().onClick()

    expect(dispatch).toHaveBeenNthCalledWith(5, {
      type: 'ENTRY_FOCUS_PREVIOUS',
      currentInFocus: '1'
    })
  })

  it('should dispatch action ENTRY_FOCUS_NEXT when next button clicked and entry seen flag is set to true', () => {
    state.entry.entries[1].seen = true
    createWrapper().find('IconButton[type="chevron-right"]').props().onClick()

    expect(dispatch).toHaveBeenNthCalledWith(5, {
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: '1'
    })
  })

  it('should dispatch action PATCH_ENTRY and ENTRY_FOCUS_NEXT when next button clicked and entry seen flag is set to false', () => {
    createWrapper().find('IconButton[type="chevron-right"]').props().onClick()

    expect(dispatch).toHaveBeenNthCalledWith(5, expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: 'api/2/subscriptionEntries/2',
      body: {
        seen: true,
        tag: 'tag2',
      }
    }))

    expect(dispatch).toHaveBeenNthCalledWith(7, {
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: '1'
    })
  })

  it('should pass expected props to entry list component', () => {
    expect(createWrapper().find('EntryList').props()).toEqual(expect.objectContaining({
      entries: [
        {uuid: '1', seen: true, tag: 'tag1'},
        {uuid: '2', seen: false, tag: 'tag2'}
      ],
      entryInFocus: {
        uuid: '1',
        seen: true,
        tag: 'tag1'
      },
      links: {
        next: {
          query: {a: 'b'}
        }
      },
      isDesktop: true,
      loading: true,
      showEntryDetails: true
    }))
  })

  it('should dispatch action PATCH_ENTRY when entry changed', () => {
    createWrapper().find('EntryList').props().onChangeEntry({uuid: '2', seen: true, tag: 'expectedTag'})

    expect(dispatch).toHaveBeenNthCalledWith(5, expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: 'api/2/subscriptionEntries/2',
      body: {
        seen: true,
        tag: 'expectedTag',
      }
    }))
  })

  it('should dispatch action GET_ENTRIES when load more button clicked', () => {
    createWrapper().find('EntryList').props().onLoadMore({path: '/expectedPath', query: {size: 2, seenEqual: 'expectedSeenEqual'}})

    expect(dispatch).toHaveBeenNthCalledWith(5, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: '/expectedPath?seenEqual=expectedSeenEqual&size=2'
    }))
  })

  it('should dispatch action ENTRY_FOCUS_PREVIOUS when arrow up key pressed', () => {
    createWrapper().find('Hotkeys').prop('onKeys').up()

    expect(dispatch).toHaveBeenNthCalledWith(5, expect.objectContaining({
      type: 'ENTRY_FOCUS_PREVIOUS',
      currentInFocus: '1'
    }))
  })

  it('should dispatch action ENTRY_FOCUS_NEXT when arrow down key pressed and entry seen flag is set to true', () => {
    state.entry.entries[1].seen = true
    createWrapper().find('Hotkeys').prop('onKeys').down()

    expect(dispatch).toHaveBeenNthCalledWith(5, expect.objectContaining({
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: '1'
    }))
  })

  it('should dispatch action PATCH_ENTRY and ENTRY_FOCUS_NEXT when next arrow down key pressed and entry seen flag is set to false', () => {
    createWrapper().find('Hotkeys').prop('onKeys').down()

    expect(dispatch).toHaveBeenNthCalledWith(5, expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: 'api/2/subscriptionEntries/2',
      body: {
        seen: true,
        tag: 'tag2',
      }
    }))

    expect(dispatch).toHaveBeenNthCalledWith(7, {
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: '1'
    })
  })

  it('should dispatch action PATCH_ENTRY when esc key pressed', () => {
    createWrapper().find('Hotkeys').prop('onKeys').esc()

    expect(dispatch).toHaveBeenNthCalledWith(5, expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: 'api/2/subscriptionEntries/1',
      body: {
        seen: false,
        tag: 'tag1',
      }
    }))
  })

  it('should dispatch action GET_ENTRIES when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?seenEqual=*&q=expectedQ'
    }))
  })

  it('should dispatch action GET_ENTRIES when prop search query parameter "q" changed', () => {
    const wrapper = createWrapper()
    wrapper.setProps({location: {search: '?q=changedQ'}})

    expect(dispatch).toHaveBeenNthCalledWith(5, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?seenEqual=*&q=changedQ'
    }))
  })

  it('should not dispatch action GET_ENTRIES when search query parameter "q" stays the same', () => {
    const wrapper = createWrapper()

    wrapper.setProps({location: {search: '?q=expectedQ&feedTagEqual=changed'}})

    expect(dispatch.mock.calls.length).toEqual(3)
  })
})
