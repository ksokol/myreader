import {toSubscription, toSubscriptions} from './subscription'

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
})
