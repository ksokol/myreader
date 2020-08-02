import {extractLinks, toUrlString} from './links'

const path = '/context/path'

describe('links', () => {

  describe('extractLinks', () => {

    it('should extract self link with path and query parameters', () =>
      expect(extractLinks([{rel: 'self', href: '/context/path?a=b&c=d'}])).toEqual({
        self: {
          path,
          query: {a: 'b', c: 'd'}
        }
      }))

    it('should extract self link with path and without query parameters', () =>
      expect(extractLinks([{rel: 'self', href: '/context/path'}])).toEqual({self: {path, query: {}}}))

    it('should extract empty self link', () =>
      expect(extractLinks([{rel: 'self', href: ''}])).toEqual({self: {path: '', query: {}}}))

    it('should extract self link with query parameters', () =>
      expect(extractLinks([{rel: 'self', href: '?a=b'}])).toEqual({self: {path: '', query: {a: 'b'}}}))

    it('should skip invalid link', () =>
      expect(extractLinks([{rel: 'self'}])).toEqual({}))

    it('should return empty object when no links defined', () =>
      expect(extractLinks()).toEqual({}))

    it('should extract self and other link', () =>
      expect(extractLinks([{rel: 'self', href: 'expected'}, {rel: 'other', href: '/other/path?a=b'}]))
        .toEqual({
          self: {
            path: 'expected',
            query: {}
          },
          other: {
            path: '/other/path',
            query: {
              a: 'b'
            }
          }

        })
    )
  })

  describe('toUrlString', () => {

    it('should return path as url when query is undefined', () =>
      expect(toUrlString({path: '/path'})).toEqual('/path'))

    it('should return path as url when query is empty', () =>
      expect(toUrlString({path: '/path', query: {}})).toEqual('/path'))

    it('should return path with query params as url when query has one parameters', () =>
      expect(toUrlString({path: '/path', query: {a: 'b'}})).toEqual('/path?a=b'))

    it('should return path with query params as url when query has multiple parameters', () =>
      expect(toUrlString({path: '/path', query: {a: 'b', c: 'd'}})).toEqual('/path?c=d&a=b'))

    it('should return query params as url when path is empty', () =>
      expect(toUrlString({path: '', query: {a: 'b', c: 'd'}})).toEqual('?c=d&a=b'))

    it('should return query params as url when path is undefined', () =>
      expect(toUrlString({query: {a: 'b'}})).toEqual('?a=b'))

    it('should return empty string as url when path and query params are undefined', () =>
      expect(toUrlString({})).toEqual(''))

    it('should skip query params with undefined or null value', () =>
      expect(toUrlString({path: '', query: {a: 'b', c: undefined, d: undefined}})).toEqual('?a=b'))
  })
})
