import {toFeed} from './feed'

describe('feed', () => {

  describe('toFeed', () => {

    it('should return valid object when raw data is undefined', () => {
      expect(toFeed()).toEqual({links: {}})
    })

    it('should convert raw data', () => {
      expect(toFeed({
        uuid: 'expected uuid',
        a: 'b',
        c: 'd',
        links: [{rel: 'self', href: '/url?a=b'}, {rel: 'other', href: '/other'}]
      })).toEqual({
        uuid: 'expected uuid',
        a: 'b',
        c: 'd',
        links: {self: {path: '/url', query: {a: 'b'}}, other: {path: '/other', query: {}}}
      })
    })
  })
})
