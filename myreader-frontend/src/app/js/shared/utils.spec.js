import {isPromiseLike, isBoolean} from './utils'

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
})
