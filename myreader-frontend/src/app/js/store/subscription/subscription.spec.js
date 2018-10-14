import {
  byPattern,
  toBody,
  toExclusionPattern,
  toExclusionPatterns,
  toSubscription,
  toSubscriptions
} from './subscription'

describe('subscription object factory', () => {

  describe('toSubscription', () => {

    it('should convert raw data', () => {
      const raw = {uuid: 1, key: 'value', feedTag: {uuid: '2', name: 'tag', color: 'yellow', links: []}}

      expect(toSubscription(raw)).toEqual({uuid: 1, key: 'value', feedTag: {uuid: '2', name: 'tag', color: 'yellow', links: []}})
    })

    it('should return valid object when input is undefined', () => {
      expect(toSubscription(undefined)).toEqual({feedTag: {uuid: undefined, name: undefined, color: undefined, links: []}})
    })

    it('should add default values for prop "feedTag" when prop "feedTag" is null', () => {
      expect(toSubscription({feedTag: null})).toEqual({feedTag: {uuid: undefined, name: undefined, color: undefined, links: []}})
    })
  })

  describe('toBody', () => {

    it('should object to raw', () => {
      const raw = {uuid: 1, key: 'value', feedTag: {name: 'tag', color: '#777'}}

      expect(toBody(raw)).toEqual({uuid: 1, key: 'value', feedTag: {name: 'tag', color: '#777'}})
    })

    it('should set prop "feedTag" to null when prop is undefined', () => {
      expect(toBody({})).toEqual({feedTag: null})
    })

    it('should set prop "feedTag" to null when prop "feedTag.name" is null', () => {
      expect(toBody({feedTag: null})).toEqual({feedTag: null})
    })
  })

  describe('toSubscriptions', () => {

    it('should convert raw data', () => {
      const raw = {
        content: [
          {
            uuid: 1,
            key: 'value',
            feedTag: {uuid: '3', name: 'tag', color: '#777', links: []}
          }, {
            uuid: 2,
            key: 'value',
            feedTag: null
          }
        ]
      }

      expect(toSubscriptions(raw)).toEqual([
        {uuid: 1, key: 'value', feedTag: {uuid: '3', name: 'tag', color: '#777', links: []}},
        {uuid: 2, key: 'value', feedTag: {uuid: undefined, name: undefined, color: undefined, links: []}}
      ])
    })

    it('should return valid object when content is empty', () => {
      expect(toSubscriptions({content: []})).toEqual([])
    })

    it('should return valid object when input is undefined', () => {
      expect(toSubscriptions(undefined)).toEqual([])
    })
  })

  describe('toExclusionPattern', () => {

    it('should return empty object when raw data is undefined', () => {
      expect(toExclusionPattern()).toEqual({})
    })

    it('should convert raw data', () =>
      expect(toExclusionPattern({uuid: '1', hitCount: 2, pattern: 'a'})).toEqual({
        uuid: '1',
        hitCount: 2,
        pattern: 'a'
      }))

    it('should return copy of pattern', () => {
      const source = {uuid: '1', hitCount: 2, pattern: 'a'}
      const converted = toExclusionPattern(source)
      source.pattern = 'x'

      expect(converted).toEqual({uuid: '1', hitCount: 2, pattern: 'a'})
    })
  })

  describe('toExclusionPatterns', () => {

    it('should return empty array when raw data is undefined', () =>
      expect(toExclusionPatterns()).toEqual([]))

    it('should convert raw data', () => {
      const raw = {content: [{pattern: 'a'}, {pattern: 'b'}, {pattern: 'c'}]}

      expect(toExclusionPatterns(raw)).toEqual([{pattern: 'a'}, {pattern: 'b'}, {pattern: 'c'}])
    })

    it('should return copy of patterns', () => {
      const raw = {content: [{pattern: 'c'}, {pattern: 'b'}, {pattern: 'a'}]}
      const converted = toExclusionPatterns(raw)
      raw.content[1].pattern = 'x'

      expect(converted).toEqual([{pattern: 'a'}, {pattern: 'b'}, {pattern: 'c'}])
    })
  })

  describe('byPattern', () => {

    it('should sort descending', () => {
      expect(byPattern({pattern: 'a'}, {pattern: 'b'})).toEqual(-1)
      expect(byPattern({pattern: 'aa'}, {pattern: 'b'})).toEqual(-1)
    })

    it('should sort ascending', () => {
      expect(byPattern({pattern: 'b'}, {pattern: 'a'})).toEqual(1)
      expect(byPattern({pattern: 'bb'}, {pattern: 'a'})).toEqual(1)
    })

    it('should keep order', () => {
      expect(byPattern({pattern: 'a'}, {pattern: 'a'})).toEqual(0)
    })
  })
})
