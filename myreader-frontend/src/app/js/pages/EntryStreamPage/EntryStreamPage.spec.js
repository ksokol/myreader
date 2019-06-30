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

jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))

jest.mock('../../contexts', () => ({
  withAppContext: Component => Component
}))
/* eslint-enable */

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
      showUnseenEntries: false,
      pageSize: 2
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

    expect(dispatch).toHaveBeenNthCalledWith(4, {
      type: 'ENTRY_FOCUS_PREVIOUS',
      currentInFocus: '1'
    })
  })

  it('should dispatch action ENTRY_FOCUS_NEXT when next button clicked and entry seen flag is set to true', () => {
    state.entry.entries[1].seen = true
    createWrapper().find(buttonNext).props().onClick()

    expect(dispatch).toHaveBeenNthCalledWith(4, {
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: '1'
    })
  })

  it('should dispatch action PATCH_ENTRY and ENTRY_FOCUS_NEXT when next button clicked and entry seen flag is set to false', () => {
    createWrapper().find(buttonNext).props().onClick()

    expect(dispatch).toHaveBeenNthCalledWith(4, expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: 'api/2/subscriptionEntries/2',
      body: {
        seen: true,
        tag: 'tag2',
      }
    }))

    expect(dispatch).toHaveBeenNthCalledWith(6, {
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

    expect(dispatch).toHaveBeenNthCalledWith(4, expect.objectContaining({
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

    expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: '/expectedPath?seenEqual=expectedSeenEqual&size=2'
    }))
  })

  it('should dispatch action ENTRY_FOCUS_PREVIOUS when arrow up key pressed', () => {
    createWrapper().find('Hotkeys').prop('onKeys').up()

    expect(dispatch).toHaveBeenNthCalledWith(4, expect.objectContaining({
      type: 'ENTRY_FOCUS_PREVIOUS',
      currentInFocus: '1'
    }))
  })

  it('should dispatch action ENTRY_FOCUS_NEXT when arrow down key pressed and entry seen flag is set to true', () => {
    state.entry.entries[1].seen = true
    createWrapper().find('Hotkeys').prop('onKeys').down()

    expect(dispatch).toHaveBeenNthCalledWith(4, expect.objectContaining({
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: '1'
    }))
  })

  it('should dispatch action PATCH_ENTRY and ENTRY_FOCUS_NEXT when next arrow down key pressed and entry seen flag is set to false', () => {
    createWrapper().find('Hotkeys').prop('onKeys').down()

    expect(dispatch).toHaveBeenNthCalledWith(4, expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: 'api/2/subscriptionEntries/2',
      body: {
        seen: true,
        tag: 'tag2',
      }
    }))

    expect(dispatch).toHaveBeenNthCalledWith(6, {
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: '1'
    })
  })

  it('should dispatch action PATCH_ENTRY when esc key pressed', () => {
    createWrapper().find('Hotkeys').prop('onKeys').esc()

    expect(dispatch).toHaveBeenNthCalledWith(4, expect.objectContaining({
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
    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?size=2&seenEqual=*&q=expectedQ'
    }))
  })

  it('should dispatch action GET_ENTRIES with seenEqual set to "*" when prop "showUnseenEntries" is set to false', () => {
    props.showUnseenEntries = false
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(1, {type: 'ENTRY_CLEAR'})
    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?size=2&seenEqual=*&q=expectedQ'
    }))
  })

  it('should dispatch action GET_ENTRIES with seenEqual set to true when prop "searchParams.seenEqual" is set to true', () => {
    props.searchParams.seenEqual = true
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(1, {type: 'ENTRY_CLEAR'})
    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?size=2&seenEqual=true&q=expectedQ'
    }))
  })

  it('should dispatch action GET_ENTRIES when prop search query parameter "q" changed', () => {
    const wrapper = createWrapper()
    wrapper.setProps({
      locationReload: true,
      searchParams: {q: 'changedQ'}
    })

    expect(dispatch).toHaveBeenNthCalledWith(4, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?size=2&seenEqual=*&q=changedQ'
    }))
  })

  it('should not dispatch action GET_ENTRIES when search query parameter "q" stays the same', () => {
    const wrapper = createWrapper()

    wrapper.setProps({location: {search: '?q=expectedQ&feedTagEqual=changed'}})

    expect(dispatch.mock.calls).toHaveLength(2)
  })

  it('should dispatch actions ENTRY_CLEAR and GET_ENTRIES when prop "locationReload" is set to true', () => {
    const wrapper = createWrapper()
    dispatch.mockClear()
    wrapper.setProps({
      locationReload: true
    })

    expect(dispatch).toHaveBeenNthCalledWith(1, {type: 'ENTRY_CLEAR'})
    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?size=2&seenEqual=*&q=expectedQ'
    }))
  })

  it('should dispatch actions ENTRY_CLEAR and GET_ENTRIES when prop "locationChanged" is set to true', () => {
    const wrapper = createWrapper()
    dispatch.mockClear()
    wrapper.setProps({
      locationChanged: true
    })

    expect(dispatch).toHaveBeenNthCalledWith(1, {type: 'ENTRY_CLEAR'})
    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?size=2&seenEqual=*&q=expectedQ'
    }))
  })

  it('should dispatch action PATCH_ENTRY with next focusable entry when next focusable entry requested', () => {
    createWrapper().find(buttonNext).props().onClick()

    expect(dispatch).toHaveBeenNthCalledWith(4, expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: 'api/2/subscriptionEntries/2',
      body: {
        seen: true,
        tag: 'tag2',
      }
    }))
  })

  it('should dispatch action ENTRY_FOCUS_NEXT when next focusable requested', () => {
    createWrapper().find(buttonNext).props().onClick()

    expect(dispatch).toHaveBeenNthCalledWith(6, {
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: '1'
    })
  })

  it('should only dispatch action ENTRY_FOCUS_NEXT when seen flag is set to true for next focusable entry', () => {
    state.entry.entries[1].seen = true
    const wrapper = createWrapper()
    dispatch.mockClear()
    wrapper.find(buttonNext).props().onClick()

    expect(dispatch.mock.calls).toHaveLength(2)
    expect(dispatch).toHaveBeenCalledWith(expect.any(Function))
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: '1'
    })
  })

  it('should not dispatch any actions when next focusable entry is not available', () => {
    state.entry.entryInFocus = '2'
    const wrapper = createWrapper()
    dispatch.mockClear()
    wrapper.find(buttonNext).props().onClick()

    expect(dispatch.mock.calls).toHaveLength(0)
  })

  it('should dispatch actions PATCH_ENTRY and ENTRY_FOCUS_NEXT when seen flag ist set to false for first focusable entry', () => {
    state.entry.entries[0].seen = false
    state.entry.entryInFocus = null
    const wrapper = createWrapper()
    dispatch.mockClear()
    wrapper.find(buttonNext).props().onClick()

    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: 'api/2/subscriptionEntries/1',
      body: {
        seen: true,
        tag: 'tag1',
      }
    }))
    expect(dispatch).toHaveBeenNthCalledWith(4, {
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: undefined
    })
  })

  it('should only dispatch action ENTRY_FOCUS_NEXT when seen flag ist set to true for first focusable entry', () => {
    state.entry.entryInFocus = null
    const wrapper = createWrapper()
    dispatch.mockClear()
    wrapper.find(buttonNext).props().onClick()

    expect(dispatch.mock.calls).toHaveLength(2)
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: 'ENTRY_FOCUS_NEXT',
      currentInFocus: undefined
    })
  })

  it('should not dispatch action ENTRY_FOCUS_NEXT when entries are not available', () => {
    state.entry.entries = []
    const wrapper = createWrapper()
    dispatch.mockClear()
    wrapper.find(buttonNext).props().onClick()

    expect(dispatch.mock.calls).toHaveLength(0)
  })
})
