import {toQueryObject} from './location-utils'

describe('location-utils', () => {

  describe('toQueryObject', () => {

    it('should return empty object when given location is undefined', () => {
      expect(toQueryObject()).toEqual({})
    })

    it('should return empty object when given location.search is undefined', () => {
      expect(toQueryObject({})).toEqual({})
    })

    it('should return empty object when given location.search is an empty string', () => {
      expect(toQueryObject({search: ''})).toEqual({})
    })

    it('should return object with search query parameters', () => {
      expect(toQueryObject({search: 'a=1&b=2'})).toEqual({a: '1', b: '2'})
    })

    it('should return object with empty value for given search query parameter', () => {
      expect(toQueryObject({search: 'a='})).toEqual({a: ''})
    })
  })
})
