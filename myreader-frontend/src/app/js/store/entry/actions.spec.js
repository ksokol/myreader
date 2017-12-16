import {entryClear, entryPageReceived, entryUpdated} from './actions'

describe('src/app/js/store/entry/actions.spec.js', () => {

    describe('ENTRY_PAGE_RECEIVED', () => {

        it('should contain expected action type', () =>
            expect(entryPageReceived()).toEqualActionType('ENTRY_PAGE_RECEIVED'))

        it('should return valid object when input is undefined', () =>
            expect(entryPageReceived()).toContainActionData({entries: [], links: {}}))

        it('should return expected action data', () =>
            expect(entryPageReceived({content: [{key: 'value'}], links: [{rel: 'self', href: 'expected?a=b'}]}))
                .toContainActionData({
                    entries: [{key: 'value'}],
                    links: {
                        self: {
                            path: 'expected',
                            query: {a: 'b'}
                        }
                    }
                })
        )
    })

    describe('ENTRY_UPDATED', () => {

        it('should contain expected action type', () =>
            expect(entryUpdated()).toEqualActionType('ENTRY_UPDATED'))

        it('should return valid object when input is undefined', () =>
            expect(entryUpdated()).toContainActionData({}))

        it('should return expected action data', () =>
            expect(entryUpdated({uuid: 1, key: 'value'})).toContainActionData({entry: {uuid: 1, key: 'value'}}))
    })

    describe('ENTRY_CLEAR', () => {

        it('should contain expected action type', () =>
            expect(entryClear()).toEqualActionType('ENTRY_CLEAR'))
    })
})
