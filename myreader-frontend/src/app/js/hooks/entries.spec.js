import React from 'react'
import {act} from 'react-dom/test-utils'
import {mount} from 'enzyme'
import {entryApi} from '../api'
import {toast} from '../components/Toast'
import {resolved, pending, rejected} from '../shared/test-utils'
import {useEntries} from './entries'

/* eslint-disable react/prop-types */
jest.mock('../api', () => ({
  entryApi: {}
}))

jest.mock('../components/Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

const expectedError = 'expected error'

describe('withEntriesFromApi', () => {

  let response, hook

  function TestComponent() {
    hook = useEntries()
    return null
  }

  const createWrapper = (onMount = resolved(response)) => {
    entryApi.fetchEntries = onMount
    const Component = TestComponent
    return mount(<Component />)
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
  })

  it('should call entryApi.fetchEntries with query', () => {
    createWrapper(pending())

    act(() => {
      hook.fetchEntries({query: {c: 'd'}})
    })

    expect(entryApi.fetchEntries).toHaveBeenCalledWith({query: {c: 'd'}})
  })

  it('should set loading to true if call entryApi.fetchEntries is pending', () => {
    createWrapper(pending())

    act(() => {
      hook.fetchEntries()
    })

    expect(hook.loading).toEqual(true)
  })

  it('should set loading to false if call entryApi.fetchEntries failed', async () => {
    createWrapper(rejected())

    await act(async () => {
      await hook.fetchEntries()
    })

    expect(hook.loading).toEqual(false)
  })

  it('should expected return entries and links if call to entryApi.fetchEntries succeeded', async () => {
    createWrapper()

    await act(async () => {
      await hook.fetchEntries()
    })

    expect(hook).toEqual(expect.objectContaining({
      entries: [
        {uuid: '1', seen: true, tag: 'tag1'},
        {uuid: '2', seen: false, tag: 'tag2'}
      ],
      links: {
        next: {
          query: {a: 'b'}
        }
      }
    }))
  })

  it('should trigger toast when call to entryApi.fetchEntries failed', async () => {
    createWrapper(rejected({data: expectedError}))

    await act(async () => {
      await hook.fetchEntries()
    })

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should call entryApi.updateEntry if function changeEntry triggered', async () => {
    entryApi.updateEntry = resolved({uuid: '2' , seen: true, tag: 'expectedTag'})
    createWrapper()

    await act(async () => {
      await hook.fetchEntries()
    })

    await act(async () => {
      await hook.changeEntry({uuid: '2', seen: true, tag: 'expectedTag'})
    })

    expect(entryApi.updateEntry).toHaveBeenCalledWith({
      uuid: '2',
      seen: true,
      tag: 'expectedTag',
      context: {
        oldValue: {
          uuid: '2',
          seen: false,
          tag: 'tag2',
        }
      }
    })
  })

  it('should return updated entries and links if call to entryApi.updateEntry succeeded', async () => {
    entryApi.updateEntry = resolved({uuid: '2' , seen: true, tag: 'expectedTag'})
    createWrapper()

    await act(async () => {
      await hook.fetchEntries()
    })

    await act(async () => {
      await hook.changeEntry({uuid: '2', seen: true, tag: 'expectedTag'})
    })

    expect(hook).toEqual(expect.objectContaining({
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

  it('should trigger toast if call to entryApi.updateEntry failed', async () => {
    entryApi.updateEntry = rejected({data: expectedError})
    await createWrapper()

    await act(async () => {
      await hook.changeEntry({uuid: '2', seen: true, tag: 'expectedTag'})
    })

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should return updated entries and links', async () => {
    createWrapper()

    await act(async () => {
      await hook.fetchEntries({})
    })

    entryApi.fetchEntries = resolved({
      entries: [{uuid: '3'}],
      links: {
        next: {
          path: 'next',
          query: {e: 'f'}
        }
      }
    })

    await act(async () => {
      await hook.fetchEntries({})
    })

    expect(hook).toEqual(expect.objectContaining({
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
      }
    }))
  })

  it('should clear entries and links', async () => {
    createWrapper()

    await act(async () => {
      await hook.fetchEntries({})
    })

    await act(async () => {
      await hook.clearEntries()
    })

    expect(hook).toEqual(expect.objectContaining({
      entries: [],
      links: {}
    }))
  })
})
