import {isBoolean, isValidDate, isValuePresent} from './utils'

describe('shared utils', () => {

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

  describe('isValuePresent', () => {

    it('should return false when given value is undefined', () => {
      expect(isValuePresent()).toEqual(false)
    })

    it('should return false when given value is null', () => {
      expect(isValuePresent(null)).toEqual(false)
    })

    it('should return true when given value is an empty string', () => {
      expect(isValuePresent('')).toEqual(true)
    })

    it('should return true when given value is number zero', () => {
      expect(isValuePresent(0)).toEqual(true)
    })

    it('should return true when given value is boolean value false', () => {
      expect(isValuePresent(false)).toEqual(true)
    })

    it('should return true when given value is an array', () => {
      expect(isValuePresent([])).toEqual(true)
    })

    it('should return true when given value is an object', () => {
      expect(isValuePresent({})).toEqual(true)
    })

    it('should return true when given value is a function', () => {
      expect(isValuePresent(() => ({}))).toEqual(true)
    })
  })
})
