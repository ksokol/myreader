import {
    changeEntry,
    entryChanged,
    entryClear,
    entryFocusNext,
    entryFocusPrevious,
    entryPageReceived,
    entryTagsReceived,
    fetchEntries,
    fetchEntryTags
} from 'store'
import {createMockStore} from '../../shared/test-utils'

describe('src/app/js/store/entry/actions.spec.js', () => {

    let store

    beforeEach(() => store = createMockStore())

    describe('ENTRY_PAGE_RECEIVED', () => {

        it('should contain expected action type', () => {
            store.dispatch(entryPageReceived())
            expect(store.getActionTypes()).toEqual(['ENTRY_PAGE_RECEIVED'])
        })

        it('should return valid object when input is undefined', () => {
            store.dispatch(entryPageReceived())
            expect(store.getActions()[0]).toContainActionData({entries: [], links: {}})
        })

        it('should return expected action data', () => {
            store.dispatch(entryPageReceived({content: [{key: 'value'}], links: [{rel: 'self', href: 'expected?a=b'}]}))
            expect(store.getActions()[0])
                .toContainActionData({
                    entries: [{key: 'value'}],
                    links: {
                        self: {
                            path: 'expected',
                            query: {a: 'b'}
                        }
                    }
                })
        })
    })

    describe('ENTRY_CHANGED', () => {

        it('should contain expected action type', () => {
            store.dispatch(entryChanged({uuid: '1'}))
            expect(store.getActionTypes()).toEqual(['ENTRY_CHANGED'])
        })

        it('should not dispatch action when input is undefined', () => {
            store.dispatch(entryChanged())
            expect(store.getActionTypes()).toEqual([])
        })

        it('should return expected action data', () => {
            store.setState({entry: {entries: [{uuid: '1', key: 'old value'}]}})

            store.dispatch(entryChanged({uuid: '1', key: 'new value'}))
            expect(store.getActions()[0])
                .toContainActionData({newValue: {uuid: '1', key: 'new value'}, oldValue: {uuid: '1', key: 'old value'}})
        })
    })

    describe('ENTRY_CLEAR', () => {

        it('should contain expected action type', () => {
            store.dispatch(entryClear())
            expect(store.getActionTypes()).toEqual(['ENTRY_CLEAR'])
        })
    })

    describe('ENTRY_FOCUS_NEXT', () => {

        it('should contain expected action type', () => {
            store.dispatch(entryFocusNext())
            expect(store.getActionTypes()).toEqual(['ENTRY_FOCUS_NEXT'])
        })

        it('should return expected action data', () => {
            store.setState({entry: {entries: [{uuid: '1'}], entryInFocus: '1'}})

            store.dispatch(entryFocusNext())
            expect(store.getActions()[0]).toContainActionData({currentInFocus: '1'})
        })
    })

    describe('ENTRY_FOCUS_PREVIOUS', () => {

        it('should not dispatch action when no entry focused', () => {
            store.dispatch(entryFocusPrevious())
            expect(store.getActionTypes()).toEqual([])
        })

        it('should contain expected action type', () => {
            store.setState({entry: {entries: [{uuid: '1'}], entryInFocus: '1'}})

            store.dispatch(entryFocusPrevious())
            expect(store.getActionTypes()).toEqual(['ENTRY_FOCUS_PREVIOUS'])
        })

        it('should return expected action data', () => {
            store.setState({entry: {entries: [{uuid: '1'}], entryInFocus: '1'}})

            store.dispatch(entryFocusPrevious())
            expect(store.getActions()[0]).toContainActionData({currentInFocus: '1'})
        })
    })

    describe('action creator fetchEntries', () => {

        beforeEach(() => store.setState({settings: {pageSize: 5}}))

        it('should contain expected action type', () => {
            store.dispatch(fetchEntries({path: '', query: {}}))

            expect(store.getActionTypes()).toEqual(['GET_ENTRIES'])
        })

        it('should dispatch with expected path and size query parameter url as action data', () => {
            store.dispatch(fetchEntries({path: '/path1', query: {seenEqual: '*'}}))

            expect(store.getActions()[0]).toContainObject({url: '/path1?size=5&seenEqual=*'})
        })

        it('should dispatch with expected path and given size query parameter url as action data', () => {
            store.dispatch(fetchEntries({path: '/path1', query: {size: 15, seenEqual: '*'}}))

            expect(store.getActions()[0]).toContainObject({url: '/path1?seenEqual=*&size=15'})
        })

        it('should dispatch with expected path and given query parameters url as action data', () => {
            store.dispatch(fetchEntries({path: '/path1', query: {a: 'b', seenEqual: '*'}}))

            expect(store.getActions()[0]).toContainObject({url: '/path1?size=5&seenEqual=*&a=b'})
        })

        it('should dispatch with seenEqual set to true as query parameter in url', () => {
            store.dispatch(fetchEntries({path: '/path1', query: {seenEqual: true}}))

            expect(store.getActions()[0]).toContainObject({url: '/path1?size=5&seenEqual=true'})
        })

        it('should dispatch with seenEqual set to false as query parameter in url', () => {
            store.dispatch(fetchEntries({path: '/path1', query: {seenEqual: false}}))

            expect(store.getActions()[0]).toContainObject({url: '/path1?size=5&seenEqual=false'})
        })

        it('should dispatch with settings value false for seenEqual when seenEqual is undefined in query parameters', () => {
            store.setState({settings: {pageSize: 5, showUnseenEntries: true}})

            store.dispatch(fetchEntries({path: '/path1', query: {}}))

            expect(store.getActions()[0]).toContainObject({url: '/path1?seenEqual=false&size=5'})
        })

        it('should dispatch with settings value * for seenEqual when seenEqual is undefined in query parameters', () => {
            store.setState({settings: {pageSize: 5, showUnseenEntries: false}})

            store.dispatch(fetchEntries({path: '/path1', query: {}}))

            expect(store.getActions()[0]).toContainObject({url: '/path1?seenEqual=*&size=5'})
        })

        it('should dispatch action defined in success property', () => {
            store.dispatch(fetchEntries({path: '/path1', query: {}}))
            store.dispatch(store.getActions()[0].success({links: [{rel: 'self', href: 'expected href'}], content: [{uuid: 'expected uuid'}]}))

            expect(store.getActions()[1]).toEqualActionType('ENTRY_PAGE_RECEIVED')
            expect(store.getActions()[1]).toContainActionData({
                entries: [{
                    uuid: 'expected uuid'
                }],
                links: {
                    self: {
                        path: 'expected href',
                        query: {}
                    }
                }
            })
        })
    })

    describe('action creator changeEntry', () => {

        it('should not dispatch action when given entry has no uuid property', () => {
            store.dispatch(changeEntry({}))

            expect(store.getActions()).toEqual([])
        })

        it('should dispatch expected action when given entry has uuid property', () => {
            store.dispatch(changeEntry({uuid: '1'}))

            expect(store.getActionTypes()).toEqual(['PATCH_ENTRY'])
        })

        it('should dispatch action with expected action data', () => {
            store.dispatch(changeEntry({uuid: '1', tag: 'expected tag', seen: true}))

            expect(store.getActions()[0])
                .toContainActionData({url: '/myreader/api/2/subscriptionEntries/1', body: {seen: true, tag: 'expected tag'}})
        })

        it('should dispatch action defined in success property', () => {
            store.dispatch(changeEntry({uuid: '1'}))
            store.dispatch(store.getActions()[0].success({uuid: 'expected uuid'}))

            expect(store.getActions()[1]).toEqualActionType('ENTRY_CHANGED')
            expect(store.getActions()[1]).toContainActionData({newValue:{uuid: 'expected uuid'}})
        })
    })

    describe('ENTRY_TAGS_RECEIVED', () => {

        it('should contain expected action type', () => {
            store.dispatch(entryTagsReceived(['tag1', 'tag2']))
            expect(store.getActionTypes()).toEqual(['ENTRY_TAGS_RECEIVED'])
        })

        it('should return expected action data', () => {
            store.dispatch(entryTagsReceived(['tag1', 'tag2']))
            expect(store.getActions()[0]).toContainActionData({tags: ['tag1', 'tag2']})
        })
    })

    describe('action creator fetchEntryTags', () => {

        it('should contain expected action type', () => {
            store.dispatch(fetchEntryTags())
            expect(store.getActionTypes()).toEqual(['GET_ENTRY_TAGS'])
        })

        it('should return expected action data', () => {
            store.dispatch(fetchEntryTags())
            expect(store.getActions()[0]).toContainActionData({url: '/myreader/api/2/subscriptionEntries/availableTags'})
        })

        it('should dispatch action defined in success property', () => {
            store.dispatch(fetchEntryTags())
            store.dispatch(store.getActions()[0].success(['tag1']))

            expect(store.getActions()[1]).toEqualActionType('ENTRY_TAGS_RECEIVED')
            expect(store.getActions()[1]).toContainActionData({tags: ['tag1']})
        })
    })
})
