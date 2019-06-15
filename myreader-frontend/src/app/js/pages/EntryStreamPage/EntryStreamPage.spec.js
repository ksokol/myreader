import React from 'react'
import {mount} from 'enzyme'
import {EntryStreamPage} from './EntryStreamPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  EntryList: ({children}) => <div>{children}</div>,
  Hotkeys: ({children}) => <div>{children}</div>,
  IconButton: ({children}) => <div>{children}</div>,
  ListLayout: ({actionPanel, listPanel}) => <div>{actionPanel}{listPanel}</div>
}))

jest.mock('../../contexts', () => ({
  withLocationState: Component => Component
}))

const buttonPrevious = 'IconButton[type="chevron-left"]'
const buttonNext = 'IconButton[type="chevron-right"]'

describe('EntryStreamPage', () => {

  let state, dispatch, props, value

  const createWrapper = () => {
    const mergedProps = {...value, ...props}
    return mount(
      <EntryStreamPage {...mergedProps} dispatch={dispatch} state={state} />
    )
  }

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
    })

    state = {
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
      searchParams: {
        q: 'expectedQ'
      },
      locationChanged: false,
      locationReload: false,
    }

    value = {
      mediaBreakpoint: 'desktop'
    }
  })

  it('should not render next and previous buttons when media breakpoint is not desktop', () => {
    value.mediaBreakpoint = 'phone'
    const wrapper = createWrapper()

    expect(wrapper.find(buttonPrevious).exists()).toEqual(false)
    expect(wrapper.find(buttonNext).exists()).toEqual(false)
  })

  it('should render next and previous buttons when media breakpoint is desktop', () => {
    const wrapper = createWrapper()

    expect(wrapper.find(buttonPrevious).exists()).toEqual(true)
    expect(wrapper.find(buttonNext).exists()).toEqual(true)
  })

  it('should trigger prop function "previousEntry" when previous button clicked', () => {
    createWrapper().find(buttonPrevious).props().onClick()

    expect(dispatch).toHaveBeenNthCalledWith(5, {
      type: 'ENTRY_FOCUS_PREVIOUS',
      currentInFocus: '1'
    })
  })

  it('should dispatch action ENTRY_FOCUS_NEXT when next button clicked and entry seen flag is set to true', () => {
    state.entry.entries[1].seen = true
    createWrapper().find(buttonNext).props().onClick()

    expect(dispatch).toHaveBeenNthCalledWith(5, {
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: '1'
    })
  })

  it('should dispatch action PATCH_ENTRY and ENTRY_FOCUS_NEXT when next button clicked and entry seen flag is set to false', () => {
    createWrapper().find(buttonNext).props().onClick()

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
      loading: true
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

  it('should dispatch actions ENTRY_CLEAR and GET_ENTRIES when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(1, {type: 'ENTRY_CLEAR'})
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?seenEqual=*&q=expectedQ'
    }))
  })

  it('should dispatch action GET_ENTRIES when prop search query parameter "q" changed', () => {
    const wrapper = createWrapper()
    wrapper.setProps({
      locationReload: true,
      searchParams: {q: 'changedQ'}
    })

    expect(dispatch).toHaveBeenNthCalledWith(6, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?seenEqual=*&q=changedQ'
    }))
  })

  it('should not dispatch action GET_ENTRIES when search query parameter "q" stays the same', () => {
    const wrapper = createWrapper()

    wrapper.setProps({location: {search: '?q=expectedQ&feedTagEqual=changed'}})

    expect(dispatch.mock.calls).toHaveLength(3)
  })

  it('should dispatch actions ENTRY_CLEAR and GET_ENTRIES when prop "locationReload" is set to true', () => {
    const wrapper = createWrapper()
    dispatch.mockClear()
    wrapper.setProps({
      locationReload: true
    })

    expect(dispatch).toHaveBeenNthCalledWith(1, {type: 'ENTRY_CLEAR'})
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?seenEqual=*&q=expectedQ'
    }))
  })

  it('should dispatch actions ENTRY_CLEAR and GET_ENTRIES when prop "locationChanged" is set to true', () => {
    const wrapper = createWrapper()
    dispatch.mockClear()
    wrapper.setProps({
      locationChanged: true
    })

    expect(dispatch).toHaveBeenNthCalledWith(1, {type: 'ENTRY_CLEAR'})
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?seenEqual=*&q=expectedQ'
    }))
  })
})
