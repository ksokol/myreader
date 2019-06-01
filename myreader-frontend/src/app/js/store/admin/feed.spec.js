import {toFeed, toFeeds} from './feed'

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

  describe('toFeeds', () => {

    it('should return valid object when raw data is undefined', () => {
      expect(toFeeds()).toEqual({feeds: []})
    })

    it('should convert raw data', () => {
      expect(toFeeds({
        content: [
          {
            uuid: 'uuid1',
            a: 'b',
            c: 'd',
            links: [{rel: 'self', href: '/uuid1?a=b'}, {rel: 'other', href: '/other'}]
          },
          {
            uuid: 'uuid2',
            e: 'f',
            links: [{rel: 'self', href: '/uuid2?a=b'}]
          }
        ]
      })).toEqual({
        feeds: [
          {
            uuid: 'uuid1',
            a: 'b',
            c: 'd',
            links: {self: {path: '/uuid1', query: {a: 'b'}}, other: {path: '/other', query: {}}}
          },
          {
            uuid: 'uuid2',
            e: 'f',
            links: {self: {path: '/uuid2', query: {a: 'b'}}}
          }
        ]
      })
    })
  })
})
