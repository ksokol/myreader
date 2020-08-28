import React from 'react'
import {act} from 'react-dom/test-utils'
import {mount} from 'enzyme'
import BookmarkListPage from './BookmarkListPage'
import {flushPromises, rejected, resolved} from '../../shared/test-utils'
import {entryApi} from '../../api'
import {toast} from '../../components/Toast'
import {useHistory, useSearchParams} from '../../hooks/router'

/* eslint-disable react/prop-types, react/display-name */
jest.mock('../../components/EntryList/EntryList', () => ({
  EntryList: () => null
}))

jest.mock('../../components/ListLayout/ListLayout', () => ({
  ListLayout: ({actionPanel, listPanel}) => <div>{actionPanel}{listPanel}</div>
}))

jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
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

jest.mock('../../components/EntryList/withEntriesFromApi', () => ({
  withEntriesFromApi: Component => Component
}))

jest.mock('../../hooks/router', () => {
  const push = jest.fn()
  const reload = jest.fn()

  return {
    useSearchParams: jest.fn().mockReturnValue({
      entryTagEqual: 'a',
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
/* eslint-enable */

const expectedTag = 'expected tag'

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

    props = {
      searchParams: {
        entryTagEqual: expectedTag,
        q: 'expectedQ'
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

  it('should trigger entryApi.fetchEntryTags when prop "locationStateStamp" changed', async () => {
    const wrapper = await createWrapper()

    entryApi.fetchEntryTags = rejected()
    wrapper.setProps({locationStateStamp: 1})

    expect(entryApi.fetchEntryTags).toHaveBeenCalled()
  })

  it('should not trigger entryApi.fetchEntryTags when prop "locationChanged" is set to true', async () => {
    const wrapper = await createWrapper()

    entryApi.fetchEntryTags.mockClear()
    wrapper.setProps({locationChanged: true})

    expect(entryApi.fetchEntryTags).not.toHaveBeenCalled()
  })

  it('should pass expected props to search input component', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('SearchInput').prop('value')).toEqual('expectedQ')
  })

  it('should trigger history push when search input value changed', async () => {
    const wrapper = await createWrapper()

    wrapper.find('SearchInput').props().onChange('changed q')
    wrapper.mount()
    wrapper.update()

    expect(useHistory().push).toHaveBeenCalledWith({
      searchParams: {
        entryTagEqual: 'a',
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

    wrapper.find('[type="redo"]').props().onClick()

    expect(useHistory().reload).toHaveBeenCalled()
  })
})
