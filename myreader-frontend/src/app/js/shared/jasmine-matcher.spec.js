import {toEqualActionType, toContainObject, toContainActionData} from './jasmine-matcher'

describe('src/app/js/shared/jasmine-matcher.spec.js', () => {

    let matcher

    describe('toEqualActionType', () => {

        beforeEach(() => matcher = toEqualActionType())

        it('should return true', () => expect(matcher.compare({type: 'ACTION'}, 'ACTION').pass).toEqual(true))

        it('should return false', () => expect(matcher.compare({type: 'ACTION'}, 'OTHER').pass).toEqual(false))

        it('should return message', () =>
            expect(matcher.compare({type: 'OTHER'}, 'ACTION').message).toEqual('Expected action type OTHER to equal ACTION'))
    })

    describe('toContainObject', () => {

        beforeEach(() => matcher = toContainObject())

        it('should return true when objects are equal', () => {
            const actual = {prop1: 'value1', nested: {prop2: 'value2'}}
            const expected = {prop1: 'value1', nested: {prop2: 'value2'}}

            expect(matcher.compare(actual, expected).pass).toEqual(true)
        })

        it('should return true when nested properties are equal', () => {
            const actual = {prop1: 'value1', nested: {prop2: 'value2'}}
            const expected = {nested: {prop2: 'value2'}}

            expect(matcher.compare(actual, expected).pass).toEqual(true)
        })

        it('should return true when properties are equal', () => {
            const actual = {prop1: 'value1', nested: {prop2: 'value2'}}
            const expected = {prop1: 'value1'}

            expect(matcher.compare(actual, expected).pass).toEqual(true)
        })

        it('should return false when nested properties are not equal', () => {
            const actual = {prop1: 'value1', nested: {prop2: 'value2'}}
            const expected = {prop1: 'value1', nested: {prop2: 'value'}}

            expect(matcher.compare(actual, expected).pass).toEqual(false)
        })

        it('should return false when properties are not equal', () => {
            const actual = {prop1: 'value1'}
            const expected = {prop1: 'value'}

            expect(matcher.compare(actual, expected).pass).toEqual(false)
        })

        it('should return message', () =>
            expect(matcher.compare({prop1: 'value1'}, {prop1: 'value'}).message)
                .toEqual('Expected {"prop1":"value1"} to contain {"prop1":"value"}'))
    })

    describe('toContainActionData', () => {

        beforeEach(() => matcher = toContainActionData())

        it('should return true', () => {
            const actual = {type: 'OTHER', nested: {prop: 'value'}}
            const expected = {type: 'ACTION', nested: {prop: 'value'}}

            expect(matcher.compare(actual, expected).pass).toEqual(true)
        })

        it('should return false', () => {
            const actual = {type: 'ACTION', nested: {prop: 'value'}}
            const expected = {type: 'ACTION', nested: {prop: 'other'}}

            expect(matcher.compare(actual, expected).pass).toEqual(false)
        })

        it('should return message', () =>
            expect(matcher.compare({prop: 'other'}, {prop: 'value'}).message)
                .toEqual('Expected action data {"prop":"other"} to contain {"prop":"value"}'))
    })
})
