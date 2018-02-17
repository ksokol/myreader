import {cloneObject} from './objects'

describe('src/app/js/store/shared/objects.spec.js', () => {

    it('should clone object', () => {
        const object = {a: 'b', c: 'd'}
        const clone = cloneObject(object)
        clone.a = 'e'
        clone.c = 'f'

        expect(object).toEqual({a: 'b', c: 'd'})
    })

    it('should deep clone object with properties', () => {
        const object = {a: 'b', c: {d: 'e'}}
        const clone = cloneObject(object)
        clone.c = {f: 'g'}

        expect(object).toEqual({a: 'b', 'c': {d: 'e'}})
    })

    it('should deep clone object with array property consists of primitives', () => {
        const object = {a: [1, 2], c: [3, 4]}
        const clone = cloneObject(object)
        clone.c = [5, 6]

        expect(object).toEqual({a: [1, 2], c: [3, 4]})
    })

    it('should deep clone object with array property consists of objects', () => {
        const object = {a: [1, 2], c: [{d: {e: 'f'}}]}
        const clone = cloneObject(object)
        clone.c[0].d.e = undefined

        expect(object).toEqual({a: [1, 2], c: [{d: {e: 'f'}}]})
    })

    it('should clone properties with null and undefined', () => {
        expect(cloneObject({a: 'b', c: null})).toEqual({a: 'b', c: null})
        expect(cloneObject({a: 'b', c: undefined})).toEqual({a: 'b', c: undefined})
    })

    it('should return undefined when given value is undefined', () => expect(cloneObject()).toEqual(undefined))

    it('should return null when given value is null', () => expect(cloneObject(null)).toEqual(null))

    it('should clone array with primitives', () => expect(cloneObject({a: ['a', 'b', 1]})).toEqual({a: ['a', 'b', 1]}))
})
