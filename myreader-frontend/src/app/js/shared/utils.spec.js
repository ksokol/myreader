import {arrayIncludes, isBoolean, isDate, isDefined, isObject, isString, toArray} from './utils'

describe('src/app/js/shared/utils.spec.js', () => {

  describe('isDefined() should return', () => {

    it('false when given parameter is undefined', () => expect(isDefined()).toEqual(false))

    it('true when given parameter is a number', () => expect(isDefined(1)).toEqual(true))

    it('true when given parameter is null', () => expect(isDefined(null)).toEqual(true))
  })

  describe('isString() should return', () => {

    it('false when given parameter is a number', () => expect(isString(1)).toEqual(false))

    it('false when given parameter is undefined', () => expect(isString()).toEqual(false))

    it('false when given parameter is null', () => expect(isString(null)).toEqual(false))

    it('false when given parameter is a function', () => expect(isString(() => {})).toEqual(false))

    it('false when given parameter is an array', () => expect(isString([])).toEqual(false))

    it('false when given parameter is an object', () => expect(isString({})).toEqual(false))

    it('false when given parameter is a date', () => expect(isString(new Date())).toEqual(false))

    it('true when given parameter is a string', () => expect(isString('a')).toEqual(true))
  })

  describe('isObject() should return', () => {

    it('false when given parameter is a number', () => expect(isObject(1)).toEqual(false))

    it('false when given parameter is a string', () => expect(isObject('a')).toEqual(false))

    it('false when given parameter is undefined', () => expect(isObject()).toEqual(false))

    it('false when given parameter is null', () => expect(isObject(null)).toEqual(false))

    it('false when given parameter is a function', () => expect(isObject(() => {})).toEqual(false))

    it('true when given parameter is an array', () => expect(isObject([])).toEqual(true))

    it('true when given parameter is an object', () => expect(isObject({})).toEqual(true))

    it('true when given parameter is a date', () => expect(isObject(new Date())).toEqual(true))
  })

  describe('isBoolean() should return', () => {

    it('false when parameter is of type string', () => expect(isBoolean('true')).toBe(false))

    it('true when parameter is of type boolean', () => expect(isBoolean(true)).toBe(true))

    it('true when parameter is of type boolean and value is false', () => expect(isBoolean(false)).toBe(true))
  })

  describe('isDate() should return', () => {

    it('false when parameter is undefined', () => expect(isDate()).toBe(false))

    it('false when parameter is null', () => expect(isDate(null)).toBe(false))

    it('false when parameter is of type string', () => expect(isDate('true')).toBe(false))

    it('false when parameter is of type boolean', () => expect(isDate(true)).toBe(false))

    it('false when parameter is of type array', () => expect(isDate([2018, 2, 17, 12, 0, 0, 0])).toBe(false))

    it('false when parameter is of type object', () => expect(isDate({})).toBe(false))

    it('true when parameter is of type Date', () => expect(isDate(new Date())).toBe(true))
  })

  describe('toArray', () => {

    it('should return empty array when given value is undefined', () => expect(toArray()).toEqual([]))

    it('should return array with object when given value is an object', () => expect(toArray({a: 'b'})).toEqual([{a: 'b'}]))

    it('should return given array when', () => expect(toArray([1, 2])).toEqual([1, 2]))
  })

  describe('arrayIncludes', () => {

    it('should return false when both values are undefined', () => expect(arrayIncludes()).toEqual(false))

    it('should return false when right value is undefined', () => expect(arrayIncludes([1])).toEqual(false))

    it('should return false when left value is undefined', () => expect(arrayIncludes(undefined, [1])).toEqual(false))

    it('should return false when arrays have different values', () => expect(arrayIncludes([1, 2], [1])).toEqual(false))

    it('should return false when right value is an object', () => expect(arrayIncludes([1], [{a: 'b'}])).toEqual(false))

    it('should return true when arrays have the same values', () => expect(arrayIncludes([1, 2], [1, 2])).toEqual(true))

    it('should return true when right array includes all values of left array', () => expect(arrayIncludes([1, 2], [1, 2, 3])).toEqual(true))
  })
})
