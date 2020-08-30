import React from 'react'
import {mount} from 'enzyme'
import {EntryStreamPage} from './EntryStreamPage'
import {useSettings} from '../../contexts/settings'
import {useMediaBreakpoint} from '../../contexts/mediaBreakpoint'
import {useHotkeys} from '../../contexts/hotkeys'
import {useHistory, useSearchParams} from '../../hooks/router'
import {useEntries} from '../../hooks/entries'

/* eslint-disable react/prop-types, react/display-name */
jest.mock('../../components', () => ({
  IconButton: ({children}) => <div>{children}</div>,
}))

jest.mock('../../components/ListLayout/ListLayout', () => ({
  ListLayout: ({actionPanel, listPanel}) => <div>{actionPanel}{listPanel}</div>,
}))

jest.mock('../../components/EntryList/EntryList', () => ({
  EntryList: ({children}) => <div>{children}</div>,
}))

jest.mock('../../hooks/router', () => {
  const push = jest.fn()
  const reload = jest.fn()
  const searchParams = {
    feedTagEqual: 'a',
    q: 'expectedQ',
  }

  return {
    useSearchParams: jest.fn().mockReturnValue(searchParams),
    useHistory: () => ({
      push,
      reload,
    })
  }
})

jest.mock('../../contexts/settings', () => ({
  useSettings: jest.fn().mockReturnValue({
    pageSize: 2,
    showUnseenEntries: true,
  })
}))

jest.mock('../../contexts/mediaBreakpoint', () => ({
  useMediaBreakpoint: jest.fn().mockReturnValue({
    isDesktop: true,
  })
}))

jest.mock('../../contexts/hotkeys', () => {
  const onKeyUp = jest.fn()

  return {
    useHotkeys: () => ({
      onKeyUp
    })
  }
})

jest.mock('../../components/EntryList/withAutofocusEntry', () => ({
  withAutofocusEntry: Component => Component
}))

jest.mock('../../hooks/entries', () => {
  return {
    useEntries: jest.fn()
  }
})
/* eslint-enable */

const buttonPrevious = 'IconButton[type="chevron-left"]'
const buttonNext = 'IconButton[type="chevron-right"]'

describe('EntryStreamPage', () => {

  const createWrapper = () => {
    return mount(<EntryStreamPage />)
  }

  beforeEach(() => {
    useEntries.mockReturnValue({
      fetchEntries: jest.fn(),
      clearEntries: jest.fn(),
    })
  })

  it('should not render next and previous buttons when media breakpoint is not desktop', () => {
    useMediaBreakpoint.mockReturnValueOnce(() => ({
      isDesktop: false,
    }))
    const wrapper = createWrapper()

    expect(wrapper.find(buttonPrevious).exists()).toEqual(false)
    expect(wrapper.find(buttonNext).exists()).toEqual(false)
  })

  it('should render next and previous buttons when media breakpoint is desktop', () => {
    const wrapper = createWrapper()

    expect(wrapper.find(buttonPrevious).exists()).toEqual(true)
    expect(wrapper.find(buttonNext).exists()).toEqual(true)
  })

  it('should fetch entries with seenEqual set to "*" and prop "showUnseenEntries" set to false', () => {
    useSettings.mockReturnValueOnce({
      pageSize: 2,
      showUnseenEntries: false,
    })
    createWrapper()

    expect(useEntries().fetchEntries).toHaveBeenCalledWith({
      query: {
        feedTagEqual: 'a',
        q: 'expectedQ',
        seenEqual: '*',
        size: 2
      }
    })
  })

  it('should fetch entries with seenEqual set to true and prop "searchParams.seenEqual" set to true', () => {
    useSearchParams.mockReturnValueOnce({
      q: 'expectedQ',
      seenEqual: true,
    })
    createWrapper()

    expect(useEntries().fetchEntries).toHaveBeenCalledWith({
      query: {
        q: 'expectedQ',
        seenEqual: true,
        size: 2
      }
    })
  })

  it('should trigger function "onKeyUp" when previous button clicked', () => {
    createWrapper().find(buttonPrevious).props().onClick()

    expect(useHotkeys().onKeyUp).toHaveBeenCalledWith({key: 'ArrowLeft'})
  })

  it('should trigger function "onKeyUp" when next button clicked', () => {
    createWrapper().find(buttonNext).props().onClick()

    expect(useHotkeys().onKeyUp).toHaveBeenCalledWith({key: 'ArrowRight'})
  })

  it('should pass expected props to search input component', () => {
    expect(createWrapper().find('SearchInput').prop('value')).toEqual('expectedQ')
  })

  it('should trigger history push when search input value changed', () => {
    const wrapper = createWrapper()
    wrapper.find('SearchInput').props().onChange('changed q')
    wrapper.mount()
    wrapper.update()

    expect(useHistory().push).toHaveBeenCalledWith({
      searchParams: {
        feedTagEqual: 'a',
        q: 'changed q'
      }
    })
  })

  it('should trigger history push when search params and search input value changed', done => {
    jest.useRealTimers()
    const wrapper = createWrapper()

    useSearchParams.mockReturnValueOnce({
      feedTagEqual: 'b',
    })
    wrapper.mount()

    wrapper.find('input[name="search-input"]').simulate('change', {
      target: {
        value: 'changed q'
      }
    })

    setTimeout(() => {
      expect(useEntries().clearEntries).toHaveBeenCalledWith()
      expect(useHistory().push).toHaveBeenCalledWith({
        searchParams: {
          feedTagEqual: 'b',
          q: 'changed q'
        }
      })
      done()
    }, 250)
  })

  it('should reload content on page when refresh icon button clicked', () => {
    const wrapper = createWrapper()
    useEntries().fetchEntries.mockClear()

    wrapper.find('[type="redo"]').props().onClick()

    expect(useEntries().clearEntries).toHaveBeenCalledWith()
    expect(useEntries().fetchEntries).toHaveBeenCalledWith({
      query: {
        feedTagEqual: 'a',
        q: 'expectedQ',
        seenEqual: false,
        size: 2,
      }
    })
    expect(useHistory().reload).toHaveBeenCalledWith()
  })

  it('should pass expected props to entry list component', () => {
    const expected = {
      entries: [{uuid: '1'}, {uuid: '2'}],
      links: {a: 'b'},
      loading: true,
      fetchEntries: jest.fn(),
      changeEntry: jest.fn(),
      onLoadMore: jest.fn()
    }
    useEntries.mockReturnValueOnce(expected)
    const wrapper = createWrapper()

    expect(wrapper.find('EntryList').props()).toEqual({
      entries: [{uuid: '1'}, {uuid: '2'}],
      links: {a: 'b'},
      loading: true,
      onChangeEntry: expected.changeEntry,
      onLoadMore: expected.fetchEntries,
    })
  })

  it('should not fetch entries again if query does not changed', () => {
    const fetchEntries = jest.fn()
    useEntries.mockReturnValue({
      fetchEntries,
      clearEntries: jest.fn(),
    })
    const wrapper = createWrapper()
    wrapper.mount()

    expect(fetchEntries).toHaveBeenCalledTimes(1)
  })

  it('should fetch entries again if query or settings changed', () => {
    const fetchEntries = jest.fn()
    useEntries.mockReturnValue({
      fetchEntries,
      clearEntries: jest.fn(),
    })
    const wrapper = createWrapper()
    wrapper.mount()

    useSearchParams.mockReturnValueOnce({
      feedTagEqual: 'a',
      q: 'changed q',
    })
    wrapper.mount()

    useSettings.mockReturnValueOnce({
      pageSize: 10,
      showUnseenEntries: true,
    })
    wrapper.mount()

    useSettings.mockReturnValueOnce({
      pageSize: 2,
      showUnseenEntries: false,
    })
    wrapper.mount()

    expect(fetchEntries).toHaveBeenCalledTimes(4)
  })
})
