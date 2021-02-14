import {toUrlString} from './links'

describe('links', () => {

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
