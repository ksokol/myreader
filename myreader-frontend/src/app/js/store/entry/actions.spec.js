import {entryPageReceived} from './actions'

describe('src/app/js/store/entry/actions.spec.js', () => {

    it('should contain expected action type', () =>
        expect(entryPageReceived()).toEqualActionType('ENTRY_PAGE_RECEIVED'))

    it('should return valid object when input is undefined', () =>
        expect(entryPageReceived()).toContainActionData({entries: [], links: {}}))

    it('should return expected action data', () =>
        expect(entryPageReceived({content: [1], links: [{rel: 'self', href: 'expected?a=b'}]}))
            .toContainActionData({
                entries: [1],
                links: {
                    self: {
                        path: 'expected',
                        query: {a: 'b'}
                    }
                }
            })
    )
})
