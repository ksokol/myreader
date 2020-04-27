import {toEqualActionType, toContainObject, toContainActionData} from './custom-matcher'

describe('src/app/js/shared/custom-matcher.spec.js', () => {

  let matcher

  describe('toContainObject', () => {

    beforeEach(() => matcher = toContainObject)

    it('should return true when objects are equal', () => {
      const actual = {prop1: 'value1', nested: {prop2: 'value2'}}
      const expected = {prop1: 'value1', nested: {prop2: 'value2'}}

      expect(matcher(actual, expected).pass).toEqual(true)
    })

    it('should return true when nested properties are equal', () => {
      const actual = {prop1: 'value1', nested: {prop2: 'value2'}}
      const expected = {nested: {prop2: 'value2'}}

      expect(matcher(actual, expected).pass).toEqual(true)
    })

    it('should return true when properties are equal', () => {
      const actual = {prop1: 'value1', nested: {prop2: 'value2'}}
      const expected = {prop1: 'value1'}

      expect(matcher(actual, expected).pass).toEqual(true)
    })

    it('should return false when nested properties are not equal', () => {
      const actual = {prop1: 'value1', nested: {prop2: 'value2'}}
      const expected = {prop1: 'value1', nested: {prop2: 'value'}}

      expect(matcher(actual, expected).pass).toEqual(false)
    })

    it('should return false when properties are not equal', () => {
      const actual = {prop1: 'value1'}
      const expected = {prop1: 'value'}

      expect(matcher(actual, expected).pass).toEqual(false)
    })

    it('should return message', () => {
      expect(matcher({prop1: 'value1'}, {prop1: 'value'}).message())
        .toEqual('Expected {"prop1":"value1"} to contain {"prop1":"value"}')
    })
  })
})
