import {isBoolean, isDate, isDefined, isObject, isString, isValidDate, toArray} from './utils'

describe('shared utils', () => {

  describe('isDefined() should return', () => {

    it('false when given parameter is undefined', () => {
      expect(isDefined()).toEqual(false)
    })

    it('true when given parameter is a number', () => {
      expect(isDefined(1)).toEqual(true)
    })

    it('true when given parameter is null', () => {
      expect(isDefined(null)).toEqual(true)
    })
  })

  describe('isString() should return', () => {

    it('false when given parameter is a number', () => {
      expect(isString(1)).toEqual(false)
    })

    it('false when given parameter is undefined', () => {
      expect(isString()).toEqual(false)
    })

    it('false when given parameter is null', () => {
      expect(isString(null)).toEqual(false)
    })

    it('false when given parameter is a function', () => {
      expect(isString(() => {})).toEqual(false)
    })

    it('false when given parameter is an array', () => {
      expect(isString(() => {})).toEqual(false)
    })

    it('false when given parameter is an object', () => {
      expect(isString({})).toEqual(false)
    })

    it('false when given parameter is a date', () => {
      expect(isString(new Date())).toEqual(false)
    })

    it('true when given parameter is a string', () => {
      expect(isString('a')).toEqual(true)
    })
  })

  describe('isObject() should return', () => {

    it('false when given parameter is a number', () => {
      expect(isObject(1)).toEqual(false)
    })

    it('false when given parameter is a string', () => {
      expect(isObject('a')).toEqual(false)
    })

    it('false when given parameter is undefined', () => {
      expect(isObject('a')).toEqual(false)
    })

    it('false when given parameter is null', () => {
      expect(isObject(null)).toEqual(false)
    })

    it('false when given parameter is a function', () => {
      expect(isObject(() => {})).toEqual(false)
    })

    it('true when given parameter is an array', () => {
      expect(isObject([])).toEqual(true)
    })

    it('true when given parameter is an object', () => {
      expect(isObject({})).toEqual(true)
    })

    it('true when given parameter is a date', () => {
      expect(isObject(new Date())).toEqual(true)
    })
  })

  describe('isBoolean() should return', () => {

    it('false when parameter is of type string', () => {
      expect(isBoolean('true')).toBe(false)
    })

    it('true when parameter is of type boolean', () => {
      expect(isBoolean(true)).toBe(true)
    })

    it('true when parameter is of type boolean and value is false', () => {
      expect(isBoolean(false)).toBe(true)
    })
  })

  describe('isDate() should return', () => {

    it('false when parameter is undefined', () => {
      expect(isDate()).toBe(false)
    })

    it('false when parameter is null', () => {
      expect(isDate(null)).toBe(false)
    })

    it('false when parameter is of type string', () => {
      expect(isDate('true')).toBe(false)
    })

    it('false when parameter is of type boolean', () => {
      expect(isDate(true)).toBe(false)
    })

    it('false when parameter is of type array', () => {
      expect(isDate([2018, 2, 17, 12, 0, 0, 0])).toBe(false)
    })

    it('false when parameter is of type object', () => {
      expect(isDate({})).toBe(false)
    })

    it('true when parameter is of type Date', () => {
      expect(isDate(new Date())).toBe(true)
    })
  })

  describe('toArray', () => {

    it('should return empty array when given value is undefined', () => {
      expect(toArray()).toEqual([])
    })

    it('should return array with object when given value is an object', () => {
      expect(toArray({a: 'b'})).toEqual([{a: 'b'}])
    })

    it('should return given array when', () => {
      expect(toArray([1, 2])).toEqual([1, 2])
    })
  })

  describe('isValidDate', () => {

    it('should return false when given argument is undefined', () => {
      expect(isValidDate()).toEqual(false)
    })

    it('should return false when given argument is null', () => {
      expect(isValidDate(null)).toEqual(false)
    })

    it('should return false when given string argument is not a date string', () => {
      expect(isValidDate('invalid')).toEqual(false)
    })

    it('should return false when given date argument is invalid', () => {
      expect(isValidDate(new Date('invalid'))).toEqual(false)
    })

    it('should return false when given argument is a number', () => {
      expect(isValidDate(0)).toEqual(false)
    })

    it('should return true when given date argument is a valid date', () => {
      expect(isValidDate(new Date(0))).toEqual(true)
    })

    it('should return true when given string argument is a valid date string', () => {
      expect(isValidDate('2017-12-31T23:59:59.9999Z')).toEqual(true)
    })
  })
})
