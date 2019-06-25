import React from 'react'
import {mount} from 'enzyme'
import BookmarkListPage from './BookmarkListPage'
import {flushPromises, rejected, resolved} from '../../shared/test-utils'
import {entryApi} from '../../api'
import {toast} from '../../components/Toast'

/* eslint-disable react/prop-types */
jest.mock('../../components/EntryList/EntryList', () => ({
  EntryList: () => null
}))

jest.mock('../../components/ListLayout/ListLayout', () => ({listPanel}) => <div>{listPanel}</div>)

jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))

jest.mock('../../contexts', () => ({
  withAppContext: Component => Component
}))

jest.mock('../../api', () => ({
  entryApi: {}
}))

jest.mock('../../components/Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

describe('BookmarkListPage', () => {

  let props, state, dispatch

  const createWrapper = async (onMount = resolved(['tag3', 'tag4'])) => {
    entryApi.fetchEntryTags = onMount

    const wrapper = mount(<BookmarkListPage {...props} state={state} dispatch={dispatch} />)
    await flushPromises()
    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    toast.mockClear()

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
        links: {next: {path: 'expected-next-path', query: {size: '2'}}},
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
      locationReload: false,
      pageSize: 2
    }
  })

  it('should pass expected props to chips component on mount when call to entryApi.fetchEntryTags succeeded', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('Chips').props()).toEqual(expect.objectContaining({
      values: ['tag3', 'tag4'],
      selected: 'expected tag'
    }))
  })

  it('should trigger toast when call to entryApi.fetchEntryTags failed', async () => {
    await createWrapper(rejected('expected error'))

    expect(toast).toHaveBeenCalledWith('expected error', {error: true})
  })

  it('should pass expected props to entry list component', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('EntryList').props()).toEqual(expect.objectContaining({
      entries: ['expected entries'],
      links: {next: {path: 'expected-next-path', query: {size: '2'}}},
      loading: true
    }))
  })

  it('should dispatch action PATCH_ENTRY when prop function "onChangeEntry" of entry list component triggered', async () => {
    const wrapper = await createWrapper()
    wrapper.find('EntryList').props().onChangeEntry({uuid: '1', seen: true, tag: 'expected tag'})

    expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
      type: 'PATCH_ENTRY',
      url: 'api/2/subscriptionEntries/1',
      body: {
        seen: true,
        tag: 'expected tag'
      }
    }))
  })

  it('should dispatch action GET_ENTRIES when prop function "onLoadMore" of entry list component triggered', async () => {
    const wrapper = await createWrapper()
    wrapper.find('EntryList').props().onLoadMore({...state.entry.links.next})

    expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'expected-next-path?size=2'
    }))
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

  it('should dispatch action GET_ENTRIES when mounted', async () => {
    props.searchParams = {
      entryTagEqual: 'expected entryTagEqual',
      size: '5',
      q: 'expectedQ'
    }

    await createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?size=2&q=expectedQ&entryTagEqual=expected entryTagEqual&seenEqual=*'
    }))
  })

  it('should dispatch action GET_ENTRIES when prop "locationReload" is set to true', async () => {
    const wrapper = await createWrapper()
    entryApi.fetchEntryTags = rejected()
    wrapper.setProps({locationReload: true})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?size=2&entryTagEqual=expected tag&seenEqual=*'
    }))
  })

  it('should dispatch action GET_ENTRIES with seenEqual set to an empty string when prop "entryTagEqual" is undefined', async () => {
    props.searchParams.entryTagEqual = null
    const wrapper = await createWrapper()
    entryApi.fetchEntryTags = rejected()
    wrapper.setProps({locationReload: true})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?size=2&seenEqual='
    }))
  })

  it('should dispatch action GET_ENTRIES when prop "locationChanged" is set to true', async () => {
    const wrapper = await createWrapper()
    entryApi.fetchEntryTags = rejected()
    wrapper.setProps({locationChanged: true})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'GET_ENTRIES',
      url: 'api/2/subscriptionEntries?size=2&entryTagEqual=expected tag&seenEqual=*'
    }))
  })

  it('should trigger entryApi.fetchEntryTags when prop "locationReload" is set to true', async () => {
    const wrapper = await createWrapper()
    entryApi.fetchEntryTags = rejected()
    wrapper.setProps({locationReload: true})

    expect(entryApi.fetchEntryTags).toHaveBeenCalled()
  })

  it('should not trigger entryApi.fetchEntryTags when prop "locationChanged" is set to true', async () => {
    const wrapper = await createWrapper()
    entryApi.fetchEntryTags.mockClear()
    wrapper.setProps({locationChanged: true})

    expect(entryApi.fetchEntryTags).not.toHaveBeenCalled()
  })
})
