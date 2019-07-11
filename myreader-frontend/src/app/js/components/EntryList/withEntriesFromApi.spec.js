import React from 'react'
import {mount} from 'enzyme'
import {withEntriesFromApi} from './withEntriesFromApi'
import {entryApi} from '../../api'
import {toast} from '../Toast'
import {flushPromises, resolved, pending, rejected} from '../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))

jest.mock('../../api', () => ({
  entryApi: {}
}))

jest.mock('../Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

const TestComponent = () => null
const expectedError = 'expected error'

describe('withEntriesFromApi', () => {

  let props, response, dispatch

  const createWrapper = async (onMount = resolved(response)) => {
    dispatch = jest.fn()
    entryApi.fetchEntries = onMount

    const Component = withEntriesFromApi(TestComponent)
    const wrapper = mount(<Component {...props} dispatch={dispatch} />)
    await flushPromises()
    wrapper.update()
    return wrapper
  }

  beforeEach(() => {
    toast.mockClear()

    response = {
      entries: [
        {uuid: '1', seen: true, tag: 'tag1'},
        {uuid: '2', seen: false, tag: 'tag2'}
      ],
      links: {
        next: {
          query: {
          a: 'b'
        }
      }
    }
    }

    props = {
      locationChanged: false,
      locationReload: false,
      changeEntry: jest.fn(),
      query: {
        c: 'd'
      }
    }
  })

  it('should call entryApi.fetchEntries with prop "query"', async () => {
    await createWrapper(pending())

    expect(entryApi.fetchEntries).toHaveBeenCalledWith({query: {c: 'd'}})
  })

  it('should set state "loading" to true when call entryApi.fetchEntries is pending', async () => {
    const wrapper = await createWrapper(pending())

    expect(wrapper.find('TestComponent').prop('loading')).toEqual(true)
  })

  it('should set state "loading" to false when call entryApi.fetchEntries is failed', async () => {
    const wrapper = await createWrapper(rejected())

    expect(wrapper.find('TestComponent').prop('loading')).toEqual(false)
  })

  it('should pass expected state to entry list component on mount when call to entryApi.fetchEntries succeeded', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('TestComponent').props()).toEqual(expect.objectContaining({
      entries: [
        {uuid: '1', seen: true, tag: 'tag1'},
        {uuid: '2', seen: false, tag: 'tag2'}
      ],
      links: {
        next: {
          query: {a: 'b'}
        }
      },
      loading: false
    }))
  })

  it('should trigger toast when call to entryApi.fetchEntries failed', async () => {
    await createWrapper(rejected(expectedError))

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should dispatch action ENTRY_CHANGED when entry changed', async () => {
    entryApi.updateEntry = resolved({uuid: '2' , seen: true, tag: 'expectedTag'})
    const wrapper = await createWrapper()
    wrapper.find('TestComponent').props().onChangeEntry({uuid: '2', seen: true, tag: 'expectedTag'})
    await flushPromises()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'ENTRY_CHANGED',
      newValue: {
        uuid: '2',
        seen: true,
        tag: 'expectedTag',
      },
      oldValue: {
        uuid: '2',
        seen: false,
        tag: 'tag2',
      }
    }))
  })

  it('should pass updated state to entry list component when call to entryApi.updateEntry succeeded', async () => {
    entryApi.updateEntry = resolved({uuid: '2' , seen: true, tag: 'expectedTag'})
    const wrapper = await createWrapper()
    wrapper.find('TestComponent').props().onChangeEntry({uuid: '2', seen: true, tag: 'expectedTag'})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('TestComponent').props()).toEqual(expect.objectContaining({
      entries: [
        {uuid: '1', seen: true, tag: 'tag1'},
        {uuid: '2', seen: true, tag: 'expectedTag'}
      ],
      links: {
        next: {
          query: {a: 'b'}
        }
      },
      loading: false
    }))
  })

  it('should trigger toast when call to entryApi.updateEntry failed', async () => {
    entryApi.updateEntry = rejected(expectedError)
    const wrapper = await createWrapper()
    wrapper.find('TestComponent').props().onChangeEntry({uuid: '2', seen: true, tag: 'expectedTag'})
    await flushPromises()

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should trigger entryApi.fetchEntries when prop function "onLoadMore" triggered', async () => {
    const path = '/expectedPath'
    const wrapper = await createWrapper()
    entryApi.fetchEntries.mockClear()
    wrapper.find('TestComponent').props().onLoadMore({path, query: {size: 2, seenEqual: 'expectedSeenEqual'}})

    expect(entryApi.fetchEntries).toHaveBeenCalledWith({path, query: {size: 2, seenEqual: 'expectedSeenEqual'}})
  })

  it('should set state "loading" to true when prop function "onLoadMore" triggered', async () => {
    const wrapper = await createWrapper(pending())
    wrapper.find('TestComponent').props().onLoadMore({query: {}})

    expect(wrapper.find('TestComponent').prop('loading')).toEqual(true)
  })

  it('should trigger toast when entryApi.fetchEntries failed after prop function "onLoadMore" triggered', async () => {
    const wrapper = await createWrapper(rejected(expectedError))
    wrapper.find('TestComponent').props().onLoadMore({})

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should pass updated state to entry list component when call to entryApi.updateEntry succeeded after prop function "onLoadMore" triggered', async () => {
    const wrapper = await createWrapper()
    entryApi.fetchEntries = resolved({
      entries: [{uuid: '3'}],
      links: {
        next: {
          path: 'next',
          query: {e: 'f'}
        }
      }
    })
    wrapper.find('TestComponent').props().onLoadMore({path: '/expectedPath', query: {}})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('TestComponent').props()).toEqual(expect.objectContaining({
      entries: [
        {uuid: '1', seen: true, tag: 'tag1'},
        {uuid: '2', seen: false, tag: 'tag2'},
        {uuid: '3'},
      ],
      links: {
        next: {
          path: 'next',
          query: {e: 'f'}
        }
      },
      loading: false
    }))
  })

  it('should trigger entryApi.fetchEntries when prop "locationReload" is set to true', async () => {
    const wrapper = await createWrapper()
    entryApi.fetchEntries.mockClear()
    wrapper.setProps({locationReload: true}, () => wrapper.setProps({locationReload: false}))

    expect(entryApi.fetchEntries).toHaveBeenCalledWith({query: {c: 'd'}})
  })

  it('should trigger entryApi.fetchEntries when prop "locationChanged" is set to true', async () => {
    const wrapper = await createWrapper()
    entryApi.fetchEntries.mockClear()
    wrapper.setProps({locationChanged: true}, () => wrapper.setProps({locationChanged: false}))

    expect(entryApi.fetchEntries).toHaveBeenCalledWith({query: {c: 'd'}})
  })
})
