import {cloneObject} from './objects'

describe('src/app/js/store/shared/objects.spec.js', () => {

    describe('removeProperties', () => {

        it('should clone object', () => {
            const object = {a: 'b', 'c': 'd'}
            const clone = cloneObject(object)
            clone.a = 'e'
            clone.c = 'f'

            expect(object).toEqual({a: 'b', 'c': 'd'})
        })

        it('should deep clone object', () => {
            const object = {a: 'b', 'c': {d: 'e'}}
            const clone = cloneObject(object)
            clone.c = {f: 'g'}

            expect(object).toEqual({a: 'b', 'c': {d: 'e'}})
        })

        it('should clone properties with null and undefined', () => {
            expect(cloneObject({a: 'b', 'c': null})).toEqual({a: 'b', 'c': null})
            expect(cloneObject({a: 'b', 'c': undefined})).toEqual({a: 'b', 'c': undefined})
        })

        it('', () => {
            expect(cloneObject()).toEqual(undefined)
            expect(cloneObject(null)).toEqual(null)
        })
    })
})
