import React from 'react'
import {act} from 'react-dom/test-utils'
import {mount} from 'enzyme'
import {BookmarkListPage} from './BookmarkListPage'
import {flushPromises, rejected, resolved} from '../../shared/test-utils'
import {entryApi} from '../../api'
import {toast} from '../../components/Toast'
import {useHistory, useSearchParams} from '../../hooks/router'
import {useEntries} from '../../hooks/entries'
import {useSettings} from '../../contexts/settings'

/* eslint-disable react/prop-types, react/display-name */
jest.mock('../../components/EntryList/EntryList', () => ({
  EntryList: () => null
}))

jest.mock('../../components/ListLayout/ListLayout', () => ({
  ListLayout: ({actionPanel, listPanel}) => <div>{actionPanel}{listPanel}</div>
}))

jest.mock('../../contexts/settings', () => ({
  useSettings: jest.fn().mockReturnValue({
    pageSize: 2
  })
}))

jest.mock('../../api', () => ({
  entryApi: {}
}))

jest.mock('../../components/Toast', () => ({
  toast: jest.fn()
}))

jest.mock('../../hooks/router', () => {
  const push = jest.fn()
  const reload = jest.fn()

  return {
    useSearchParams: jest.fn().mockReturnValue({
      entryTagEqual: 'expected tag',
      q: 'expectedQ'
    }),
    useHistory: () => ({
      push,
      reload,
    })
  }
})

jest.mock('../../components', () => ({
  IconButton: ({children}) => <div>{children}</div>,
}))

jest.mock('../../hooks/entries', () => {
  return {
    useEntries: jest.fn()
  }
})
/* eslint-enable */

const expectedTag = 'expected tag'
const expectedQ = 'expectedQ'

describe('BookmarkListPage', () => {

  let props

  const createWrapper = async (onMount = resolved(['tag3', 'tag4'])) => {
    let wrapper

    await act(async () => {
      entryApi.fetchEntryTags = onMount

      wrapper = mount(<BookmarkListPage {...props} />)
      await flushPromises()
      wrapper.update()
    })
    wrapper.mount()
    wrapper.update()

    return wrapper
  }

  beforeEach(() => {
    toast.mockClear()
    useEntries.mockReturnValue({
      fetchEntries: jest.fn(),
      clearEntries: jest.fn(),
    })

    props = {
      searchParams: {
        entryTagEqual: expectedTag,
        q: expectedQ
      },
      historyReplace: jest.fn(),
      locationStateStamp: 0,
    }
  })

  it('should pass expected props to chips component on mount when call to entryApi.fetchEntryTags succeeded', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('Chips').props()).toEqual(expect.objectContaining({
      values: ['tag3', 'tag4'],
      selected: expectedTag
    }))
  })

  it('should trigger toast when call to entryApi.fetchEntryTags failed', async () => {
    await createWrapper(rejected({data: 'expected error'}))

    expect(toast).toHaveBeenCalledWith('expected error', {error: true})
  })

  it('should fetch entries with seenEqual set to "*"', async () => {
    await createWrapper()

    expect(useEntries().fetchEntries).toHaveBeenCalledWith({
      query: {
        entryTagEqual: expectedTag,
        q: expectedQ,
        seenEqual: '*',
        size: 2
      }
    })
  })

  it('should fetch entries with prop "searchParam.entryTagEqual" undefined', async () => {
    useSearchParams.mockReturnValueOnce({
      q: expectedQ,
    })
    await createWrapper()

    expect(useEntries().fetchEntries).toHaveBeenCalledWith({
      query: {
        q: expectedQ,
        seenEqual: '',
        size: 2
      }
    })
  })

  it('should pass expected props to entry list component', async () => {
    const expected = {
      entries: [{uuid: '1'}, {uuid: '2'}],
      links: {a: 'b'},
      loading: true,
      fetchEntries: jest.fn(),
      clearEntries: jest.fn(),
      changeEntry: jest.fn(),
      onLoadMore: jest.fn()
    }
    useEntries.mockReturnValue(expected)
    const wrapper = await createWrapper()

    expect(wrapper.find('EntryList').props()).toEqual({
      entries: [{uuid: '1'}, {uuid: '2'}],
      links: {a: 'b'},
      loading: true,
      onChangeEntry: expected.changeEntry,
      onLoadMore: expected.fetchEntries,
    })
  })

  it('should return expected prop from Chips prop function "renderItem"', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('Chips').props().renderItem('tag').props).toEqual(expect.objectContaining({
      to: {
        pathname: '/app/bookmark',
        search: '?entryTagEqual=tag'
      }
    }))
  })

  it('should trigger entryApi.fetchEntryTags on mount', async () => {
    await createWrapper()

    expect(entryApi.fetchEntryTags).toHaveBeenCalled()
  })

  it('should pass expected props to search input component', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('SearchInput').prop('value')).toEqual(expectedQ)
  })

  it('should trigger history push when search input value changed', async () => {
    const wrapper = await createWrapper()

    wrapper.find('SearchInput').props().onChange('changed q')
    wrapper.mount()
    wrapper.update()

    expect(useHistory().push).toHaveBeenCalledWith({
      searchParams: {
        entryTagEqual: expectedTag,
        q: 'changed q'
      }
    })
  })

  it('should trigger history push when search params and search input value changed', async (done) => {
    jest.useRealTimers()
    const wrapper = await createWrapper()

    useSearchParams.mockReturnValueOnce({
      entryTagEqual: 'b',
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
          entryTagEqual: 'b',
          q: 'changed q'
        }
      })
      done()
    }, 250)
  })

  it('should trigger history reload when refresh icon button clicked', async () => {
    const wrapper = await createWrapper()

    await act(async () => {
      await wrapper.find('[type="redo"]').props().onClick()
    })

    expect(useHistory().reload).toHaveBeenCalled()
  })

  it('should reload content on page when refresh icon button clicked', async () => {
    const wrapper = await createWrapper()
    useEntries().fetchEntries.mockClear()

    await act(async () => {
      wrapper.find('[type="redo"]').props().onClick()
    })

    expect(useEntries().clearEntries).toHaveBeenCalledWith()
    expect(entryApi.fetchEntryTags).toHaveBeenCalled()
    expect(useEntries().fetchEntries).toHaveBeenCalledWith({
      query: {
        entryTagEqual: expectedTag,
        q: expectedQ,
        seenEqual: '*',
        size: 2,
      }
    })
    expect(useHistory().reload).toHaveBeenCalledWith()
  })

  it('should not fetch entries again if query does not changed', async () => {
    const fetchEntries = jest.fn()
    useEntries.mockReturnValue({
      fetchEntries,
      clearEntries: jest.fn(),
    })
    const wrapper = await createWrapper()
    wrapper.mount()

    expect(fetchEntries).toHaveBeenCalledTimes(1)
  })

  it('should fetch entries again if query or settings changed', async () => {
    const fetchEntries = jest.fn()
    useEntries.mockReturnValue({
      fetchEntries,
      clearEntries: jest.fn(),
    })
    const wrapper = await createWrapper()
    wrapper.mount()

    useSearchParams.mockReturnValueOnce({
      entryTagEqual: expectedTag,
      q: 'changed q',
    })
    wrapper.mount()

    useSearchParams.mockReturnValueOnce({
      q: expectedQ,
    })
    wrapper.mount()

    useSettings.mockReturnValueOnce({
      pageSize: 10,
    })
    wrapper.mount()

    expect(fetchEntries).toHaveBeenCalledTimes(4)
  })
})
