import {
    applicationInfoReceived,
    changeFeed,
    deleteFeed,
    feedClear,
    feedDeleted,
    feedFetchFailuresClear,
    feedFetchFailuresReceived,
    feedReceived,
    fetchApplicationInfo,
    fetchFeed,
    fetchFeedFetchFailures,
    rebuildSearchIndex
} from 'store'
import {createMockStore} from 'shared/test-utils'

describe('src/app/js/store/admin/action.spec.js', () => {

    let store

    beforeEach(() => store = createMockStore())

    describe('action creator rebuildSearchIndex', () => {

        it('action creator rebuildSearchIndex', () => {
            store.dispatch(rebuildSearchIndex())
            expect(store.getActions()[0]).toContainObject({
                type: 'PUT_INDEX_SYNC_JOB',
                url: '/myreader/api/2/processing',
                body: {process: 'indexSyncJob'}
            })
        })

        it('action creator rebuildSearchIndex should contain notification action creator in success property', () => {
            const action = store.dispatch(rebuildSearchIndex())
            store.dispatch(action.success())

            expect(store.getActions()[1]).toContainObject({
                type: 'SHOW_NOTIFICATION',
                notification: {
                    text: 'Indexing started',
                    type: 'success'
                }
            })
        })
    })

    describe('action creator applicationInfoReceived', () => {

        it('should contain expected action type', () => {
            store.dispatch(applicationInfoReceived())

            expect(store.getActionTypes()).toEqual(['APPLICATION_INFO_RECEIVED'])
        })

        it('should contain expected patch action type', () => {
            const raw = {
                git: {
                    commit: {
                        id: 'a'
                    },
                    branch: 'b'
                },
                build: {
                    version: 'c',
                    time: 'd'
                }
            }

            store.dispatch(applicationInfoReceived(raw))

            expect(store.getActions()[0]).toContainActionData({
                applicationInfo: {
                    commitId: 'a',
                    branch: 'b',
                    version: 'c',
                    buildTime: 'd'
                }
            })
        })
    })

    describe('action creator fetchApplicationInfo', () => {

        it('should contain expected action type', () => {
            store.dispatch(fetchApplicationInfo())

            expect(store.getActionTypes()).toEqual(['GET_APPLICATION_INFO'])
            expect(store.getActions()[0]).toContainActionData({url: '/myreader/info'})
        })

        it('should dispatch action defined in success property', () => {
            store.dispatch(fetchApplicationInfo())
            const success = store.getActions()[0].success
            store.clearActions()
            store.dispatch(success())

            expect(store.getActionTypes()).toEqual(['APPLICATION_INFO_RECEIVED'])
            expect(store.getActions()[0]).toContainActionData({
                applicationInfo: {
                    branch: 'not available',
                    commitId: 'not available',
                    version: 'not available',
                    buildTime: ''
                }
            })
        })

        it('should dispatch action defined in error property', () => {
            store.dispatch(fetchApplicationInfo())
            const error = store.getActions()[0].error
            store.clearActions()
            store.dispatch(error())

            expect(store.getActionTypes()).toEqual(['SHOW_NOTIFICATION'])
            expect(store.getActions()[0]).toContainActionData({
                notification: {
                    text: 'Application info is missing',
                    type: 'error'
                }
            })
        })
    })

    describe('action creator feedFetchFailuresClear', () => {

        it('should contain expected action type', () => {
            store.dispatch(feedFetchFailuresClear())

            expect(store.getActionTypes()).toEqual(['FEED_FETCH_FAILURES_CLEAR'])
        })
    })

    describe('action creator feedClear', () => {

        it('should contain expected action type', () => {
            store.dispatch(feedClear())

            expect(store.getActionTypes()).toEqual(['FEED_CLEAR'])
        })
    })

    describe('action creator feedReceived', () => {

        it('should contain expected action type', () => {
            store.dispatch(feedReceived())

            expect(store.getActionTypes()).toEqual(['FEED_RECEIVED'])
        })

        it('should contain expected action data', () => {
            store.dispatch(feedReceived({
                links: [{rel: 'self', href: 'expected href'}],
                uuid: '1',
                a: 'b'
            }))

            expect(store.getActions()[0]).toContainActionData({
                feed: {
                    links: {self: {path: 'expected href', query: {}}},
                    uuid: '1',
                    a: 'b'
                }
            })
        })
    })

    describe('action creator fetchFeed', () => {

        it('should contain expected action type', () => {
            store.dispatch(fetchFeed({}))

            expect(store.getActionTypes()).toEqual(['GET_FEED'])
        })

        it('should contain expected action data', () => {
            store.dispatch(fetchFeed('expectedUuid'))

            expect(store.getActions()[0].url).toContain('/feeds/expectedUuid')
        })

        it('should dispatch action defined in success property', () => {
            store.dispatch(fetchFeed({}))
            const success = store.getActions()[0].success
            store.clearActions()
            store.dispatch(success({links: [{rel: 'self', href: 'expected href'}], uuid: '1', a: 'b'}))

            expect(store.getActionTypes()).toEqual(['FEED_RECEIVED'])
            expect(store.getActions()[0]).toContainActionData({
                feed: {
                    links: {self: {path: 'expected href', query: {}}},
                    uuid: '1',
                    a: 'b'
                }
            })
        })
    })

    describe('action creator changeFeed', () => {

        it('should contain expected action type', () => {
            store.dispatch(changeFeed({}))

            expect(store.getActionTypes()).toEqual(['PATCH_FEED'])
        })

        it('should contain expected action data', () => {
            store.dispatch(changeFeed({uuid: 'expectedUuid', title: 'expected title', url: 'expected url'}))

            expect(store.getActions()[0].url).toContain('/feeds/expectedUuid')
            expect(store.getActions()[0].body).toEqual({title: 'expected title', url: 'expected url'})
        })

        it('should return action creator feedReceived from success property', () =>
            expect(changeFeed({}).success()).toEqual({type: 'FEED_RECEIVED', feed: {links: {}}}))
    })

    describe('action creator feedDeleted', () => {

        it('should contain expected action type', () => {
            store.dispatch(feedDeleted())

            expect(store.getActionTypes()).toEqual(['FEED_DELETED'])
        })

        it('should contain expected action data', () => {
            store.dispatch(feedDeleted('expectedUuid'))

            expect(store.getActions()[0]).toContainActionData({uuid: 'expectedUuid'})
        })
    })

    describe('action creator deleteFeed', () => {

        it('should contain expected action type', () => {
            store.dispatch(deleteFeed())

            expect(store.getActionTypes()).toEqual(['DELETE_FEED'])
        })

        it('should contain expected action data', () => {
            store.dispatch(deleteFeed('expectedUuid'))

            expect(store.getActions()[0].url).toContain('/feeds/expectedUuid')
        })

        it('should return action creator feedDeleted from success property', () =>
            expect(deleteFeed('expectedUuid').success()).toEqual({type: 'FEED_DELETED', uuid: 'expectedUuid'}))
    })

    describe('action creator feedFetchFailuresReceived', () => {

        it('should contain expected action type', () => {
            store.dispatch(feedFetchFailuresReceived())

            expect(store.getActionTypes()).toEqual(['FEED_FETCH_FAILURES_RECEIVED'])
        })

        it('should contain expected action data', () => {
            store.dispatch(feedFetchFailuresReceived({
                links: [{rel: 'expected rel', href: 'expected href'}],
                content: [{message: 'message 1'}],
                page: {totalElements: 1}
            }))

            expect(store.getActions()[0]).toContainActionData({
                failures: [{message: 'message 1'}],
                links: {'expected rel': {path: 'expected href', query: {}}},
                totalElements: 1
            })
        })
    })

    describe('action creator fetchFeedFetchFailures', () => {

        it('should contain expected action type', () => {
            store.dispatch(fetchFeedFetchFailures({}))

            expect(store.getActionTypes()).toEqual(['GET_FEED_FETCH_FAILURES'])
        })

        it('should contain expected action data', () => {
            store.dispatch(fetchFeedFetchFailures({path: 'expected-path', query: {a: 'b'}}))

            expect(store.getActions()[0]).toContainActionData({url: 'expected-path?a=b'})
        })

        it('should dispatch action defined in success property', () => {
            store.dispatch(fetchFeedFetchFailures({}))
            const success = store.getActions()[0].success
            store.clearActions()
            store.dispatch(success({content: [{message: 'message 1'}], links: [{rel: 'self', href: '/expected'}], page: {totalElements: 1}}))

            expect(store.getActionTypes()).toEqual(['FEED_FETCH_FAILURES_RECEIVED'])
            expect(store.getActions()[0]).toContainActionData({
                links: {self: {path: '/expected', query: {}}},
                failures: [{message: 'message 1'}],
                totalElements: 1
            })
        })
    })
})
