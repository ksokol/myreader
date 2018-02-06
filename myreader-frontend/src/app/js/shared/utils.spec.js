import {arrayEquals, isBoolean, isPromiseLike, toArray} from './utils'

describe('src/app/js/shared/spec.js', () => {

    describe('isPromiseLike() should return', () => {

        describe('false when parameter', () => {

            it('is undefined or null', () => {
                expect(isPromiseLike()).toEqual(false)
                expect(isPromiseLike(null)).toEqual(false)
            })

            it('is null', () =>
                expect(isPromiseLike(null)).toEqual(false))

            it('is undefined', () =>
                expect(isPromiseLike(undefined)).toEqual(false))

            it('is a primitive type', () =>
                expect(isPromiseLike(42)).toEqual(false))

            it('is an empty object', () =>
                expect(isPromiseLike({})).toEqual(false))

            it('has invalid properties then, catch and finally', () => {
                const fn = () => {}
                const obj = {
                    then: 'then',
                    catch: 'catch'
                }

                expect(isPromiseLike(obj)).toEqual(false)

                obj.then = fn
                expect(isPromiseLike(obj)).toEqual(false)
            })
        })

        describe('true when parameter', () => {

            it('has valid properties then, catch and finally', () => {
                const fn = () => {}

                const obj = {
                    then: fn,
                    catch: fn,
                    finally: fn
                }

                expect(isPromiseLike(obj)).toEqual(true)
            })
        })
    })

    describe('isBoolean() should return', () => {

        it('false when parameter is of type string', () =>
           expect(isBoolean('true')).toBe(false))

        it('true when parameter is of type boolean', () =>
            expect(isBoolean(true)).toBe(true))

        it('true when parameter is of type boolean and value is false', () =>
            expect(isBoolean(false)).toBe(true))
    })

    describe('toArray', () => {

        it('should return empty array when given value is undefined', () => expect(toArray()).toEqual([]))

        it('should return array with object when given value is an object', () => expect(toArray({a: 'b'})).toEqual([{a: 'b'}]))

        it('should return given array when', () => expect(toArray([1, 2])).toEqual([1, 2]))
    })

    describe('arrayEquals', () => {

        it('should return false when both values are undefined', () => expect(arrayEquals()).toEqual(false))

        it('should return false when right value is undefined', () => expect(arrayEquals([1])).toEqual(false))

        it('should return false when left value is undefined', () => expect(arrayEquals(undefined, [1])).toEqual(false))

        it('should return false when arrays have different values', () => expect(arrayEquals([1, 2], [1])).toEqual(false))

        it('should return false when right value is an object', () => expect(arrayEquals([1], [{a: 'b'}])).toEqual(false))

        it('should return true when arrays have the same values', () => expect(arrayEquals([1, 2], [1, 2])).toEqual(true))
    })
})
