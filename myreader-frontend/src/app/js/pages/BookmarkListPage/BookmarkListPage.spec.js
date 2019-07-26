import React from 'react'
import {mount} from 'enzyme'
import BookmarkListPage from './BookmarkListPage'
import {flushPromises, rejected, resolved} from '../../shared/test-utils'
import {entryApi} from '../../api'
import {toast} from '../../components/Toast'

/* eslint-disable react/prop-types, react/display-name */
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

jest.mock('../../components/EntryList/withEntriesFromApi', () => ({
  withEntriesFromApi: Component => Component
}))
/* eslint-enable */

const expectedTag = 'expected tag'

describe('BookmarkListPage', () => {

  let props

  const createWrapper = async (onMount = resolved(['tag3', 'tag4'])) => {
    entryApi.fetchEntryTags = onMount

    const wrapper = mount(<BookmarkListPage {...props} />)
    await flushPromises()
    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    toast.mockClear()

    props = {
      searchParams: {
        entryTagEqual: expectedTag,
        q: 'expectedQ'
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
      selected: expectedTag
    }))
  })

  it('should trigger toast when call to entryApi.fetchEntryTags failed', async () => {
    await createWrapper(rejected({data: 'expected error'}))

    expect(toast).toHaveBeenCalledWith('expected error', {error: true})
  })

  it('should pass expected props to entry list component', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('EntryList').prop('query')).toEqual({
      entryTagEqual: expectedTag,
      q: 'expectedQ',
      seenEqual: '*',
      size: 2
    })
  })

  it('should pass expected props to entry list component with prop "searchParam.entryTagEqual" undefined', async () => {
    delete props.searchParams.entryTagEqual
    const wrapper = await createWrapper()

    expect(wrapper.find('EntryList').prop('query')).toEqual({
      q: 'expectedQ',
      seenEqual: '',
      size: 2
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
