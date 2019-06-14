import {toSubscriptions} from './subscription'

describe('subscription object factory', () => {

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
