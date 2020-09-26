import {renderHook, act} from '@testing-library/react-hooks'
import {entryApi} from '../api'
import {toast} from '../components/Toast'
import {useEntries} from './entries'

/* eslint-disable react/prop-types */
jest.mock('../api', () => {
  const {entryApi: api} = jest.requireActual('../api')
  jest.spyOn(api, 'updateEntry')
  return {
    entryApi: api
  }
})

jest.mock('../components/Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

const expectedError = 'expected error'
const entry2Url = 'api/2/subscriptionEntries/2'

describe('entries hook', () => {

  let response

  beforeEach(() => {
    toast.mockClear()

    response = {
      content: [
        {uuid: '1', seen: true, tags: ['tag1']},
        {uuid: '2', seen: false, tags: ['tag2']}
      ],
      links: [{
        rel: 'next',
        href: 'http://localhost/test?a=b'
      }],
    }
  })

  describe('fetchEntries', () => {

    it('should fetch with query', async () => {
      const {result} = renderHook(() => useEntries())

      await act(async () => {
        await result.current.fetchEntries({query: {c: 'd'}})
      })

      expect(fetch.mostRecent()).toMatchGetRequest({
        url: 'api/2/subscriptionEntries?c=d'
      })
    })

    it('should set loading to true', async () => {
      const {result} = renderHook(() => useEntries())
      fetch.responsePending()

      act(() => {
        result.current.fetchEntries({})
      })
      expect(result.current.loading).toEqual(true)
    })

    it('should set loading to false if call entryApi.fetchEntries failed', async () => {
      fetch.rejectResponse(expectedError)
      const {result} = renderHook(() => useEntries())

      await act(async () => {
        await result.current.fetchEntries({})
      })

      expect(result.current.loading).toEqual(false)
    })

    it('should return updated entries and links', async () => {
      fetch.jsonResponse({
        content: [{uuid: '3'}],
        links: [{
          next: {
            path: 'http://localhost/next',
            query: {e: 'f'},
          }
        }]
      })
      const {result} = renderHook(() => useEntries())

      await act(async () => {
        await result.current.fetchEntries({})
      })

      fetch.jsonResponse(response)
      await act(async () => {
        await result.current.fetchEntries({})
      })

      expect(result.current).toEqual(expect.objectContaining({
        entries: [
          {uuid: '3'},
          {uuid: '1', seen: true, tags: ['tag1']},
          {uuid: '2', seen: false, tags: ['tag2']},
        ],
        links: {
          next: {
            path: 'http://localhost/test',
            query: {a: 'b'},
          }
        }
      }))
    })

    it('should show error when fetch failed', async () => {
      fetch.rejectResponse({data: expectedError})
      const {result} = renderHook(() => useEntries())

      await act(async () => {
        await result.current.fetchEntries({})
      })

      expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
    })
  })

  describe('changeEntry', () => {

    it('should change entry', async () => {
      fetch.jsonResponse(response)
      const {result} = renderHook(() => useEntries())

      await act(async () => {
        await result.current.fetchEntries({})
      })
      await act(async () => {
        await result.current.changeEntry({uuid: '2', seen: true, tags: ['expectedTag']})
      })

      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry2Url,
        body: {
          seen: true,
          tags: ['expectedTag'],
        },
      })
      expect(entryApi.updateEntry).toHaveBeenCalledWith(expect.objectContaining({
        context: {
          oldValue: {
            uuid: '2',
            seen: false,
            tags: ['tag2'],
          }
        }
      }))
    })

    it('should show error when change failed', async () => {
      fetch.rejectResponse({data: expectedError})
      const {result} = renderHook(() => useEntries())

      await act(async () => {
        await result.current.changeEntry({uuid: '2', seen: true, tag: 'expectedTag'})
      })

      expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
    })
  })

  describe('clearEntries', () => {

    it('should return updated entries and links', async () => {
      fetch.jsonResponse(response)
      const {result} = renderHook(() => useEntries())

      await act(async () => {
        await result.current.fetchEntries({})
      })

      fetch.jsonResponse({
        uuid: '2' ,
        seen: true,
        tags: ['expectedTag']
      })
      await act(async () => {
        await result.current.changeEntry({uuid: '2', seen: true, tags: ['expectedTag']})
      })

      expect(result.current).toEqual(expect.objectContaining({
        entries: [
          {uuid: '1', seen: true, tags: ['tag1']},
          {uuid: '2', seen: true, tags: ['expectedTag']}
        ],
        links: {
          next: {
            path: 'http://localhost/test',
            query: {a: 'b'},
          }
        },
        loading: false,
      }))
    })

    it('should clear entries and links', async () => {
      fetch.jsonResponse(response)
      const {result} = renderHook(() => useEntries())

      await act(async () => {
        await result.current.fetchEntries({})
      })
      await act(async () => {
        await result.current.clearEntries()
      })

      expect(result.current).toEqual(expect.objectContaining({
        entries: [],
        links: {}
      }))
    })
  })

  describe('setSeenFlag', () => {

    it('should set flag', async () => {
      fetch.jsonResponse(response)
      const {result} = renderHook(() => useEntries())

      await act(async () => {
        await result.current.fetchEntries({})
      })

      fetch.jsonResponse({
        uuid: '2' ,
        seen: true,
        tags: ['expectedTag']
      })
      await act(async () => {
        await result.current.setSeenFlag('2')
      })

      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry2Url,
        body: {
          seen: true,
          tags: ['tag2'],
        },
      })
      expect(entryApi.updateEntry).toHaveBeenCalledWith(expect.objectContaining({
        context: {
          oldValue: {
            uuid: '2',
            seen: false,
            tags: ['tag2'],
          }
        }
      }))
      expect(result.current).toEqual(expect.objectContaining({
        entries: [
          {uuid: '1', seen: true, tags: ['tag1']},
          {uuid: '2', seen: true, tags: ['expectedTag']}
        ],
        loading: false,
      }))
    })

    it('should show error when change to flag failed', async () => {
      const {result} = renderHook(() => useEntries())

      fetch.jsonResponse(response)
      await act(async () => {
        await result.current.fetchEntries({})
      })

      fetch.rejectResponse({data: expectedError})
      await act(async () => {
        await result.current.setSeenFlag('2')
      })

      expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
    })
  })

  describe('toggleSeenFlag', () => {

    it('should toggle flag', async () => {
      fetch.jsonResponse(response)
      const {result} = renderHook(() => useEntries())

      await act(async () => {
        await result.current.fetchEntries({})
      })

      fetch.jsonResponse({
        uuid: '2' ,
        seen: true,
        tags: ['expectedTag']
      })
      await act(async () => {
        await result.current.toggleSeenFlag('2')
      })

      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: 'api/2/subscriptionEntries/2',
        body: {
          seen: true,
          tags: ['tag2'],
        },
      })
      expect(entryApi.updateEntry).toHaveBeenCalledWith(expect.objectContaining({
        context: {
          oldValue: {
            uuid: '2',
            seen: false,
            tags: ['tag2'],
          }
        }
      }))
      expect(result.current).toEqual(expect.objectContaining({
        entries: [
          {uuid: '1', seen: true, tags: ['tag1']},
          {uuid: '2', seen: true, tags: ['expectedTag']}
        ],
        loading: false,
      }))
    })

    it('should show error when toggle failed', async () => {
      const {result} = renderHook(() => useEntries())

      fetch.jsonResponse(response)
      await act(async () => {
        await result.current.fetchEntries({})
      })

      fetch.rejectResponse({data: expectedError})
      await act(async () => {
        await result.current.toggleSeenFlag('2')
      })

      expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
    })
  })
})
