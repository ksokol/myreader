import initialState from '.'
import {adminReducers} from 'store'

describe('src/app/js/store/admin/reducers.spec.js', () => {

    let state, action

    beforeEach(() => state = initialState())

    it('initial state', () =>
        expect(adminReducers(state, {type: 'UNKNOWN_ACTION'})).toEqual(state))

    describe('action APPLICATION_INFO_RECEIVED', () => {

        it('should do nothing when no entry focused', () => {
            const action = {
                type: 'APPLICATION_INFO_RECEIVED',
                applicationInfo: {a: 'b', c: 'd'}
            }

            const currentState = {applicationInfo: {}}
            const expectedState = {applicationInfo: {a: 'b', c: 'd'}}

            expect(adminReducers(currentState, action)).toContainObject(expectedState)
        })
    })

    describe('action SECURITY_UPDATE', () => {

        beforeEach(() => {
            action = {
                type: 'SECURITY_UPDATE',
                authorized: false
            }
        })

        it('should reset state when not authorized', () => {
            const currentState = {applicationInfo: {a: 'b'}}

            expect(adminReducers(currentState, action)).toContainObject(initialState())
        })

        it('should do nothing when authorized', () => {
            action.authorized = true

            const currentState = {applicationInfo: {a: 'b'}}
            const expectedState = {applicationInfo: {a: 'b'}}

            expect(adminReducers(currentState, action)).toContainObject(expectedState)
        })
    })

    describe('action FEED_CLEAR', () => {

        it('should clear selected feed', () => {
            state = {selectedFeed: {a: 'b', c: 'd'}}

            expect(adminReducers(state, {type: 'FEED_CLEAR'}).selectedFeed).toEqual({})
        })
    })

    describe('action FEED_RECEIVED', () => {

        it('should add selected feed', () => {
            state = {selectedFeed: {}}

            expect(adminReducers(state, {type: 'FEED_RECEIVED', feed: {a: 'b', c: 'd'}}).selectedFeed).toEqual({a: 'b', c: 'd'})
        })

        it('should replace existing selected feed', () => {
            state = {selectedFeed: {a: 'b', c: 'd'}}

            expect(adminReducers(state, {type: 'FEED_RECEIVED', feed: {e: 'f'}}).selectedFeed).toEqual({e: 'f'})
        })
    })

    describe('action FEED_DELETED', () => {

        it('should clear selected feed', () => {
            state = {selectedFeed: {a: 'b', c: 'd'}}

            expect(adminReducers(state, {type: 'FEED_DELETED'}).selectedFeed).toEqual({})
        })
    })

    describe('action FEED_FETCH_FAILURES_CLEAR', () => {

        it('should clear feed fetch failures', () => {
            state = {
                fetchFailures: {
                    failures: [1, 2],
                    links: {
                        self: {
                            path: 'path1', query: {a: 'b', next: 'c'}
                        }
                    },
                    totalElements: 2
                }
            }

            expect(adminReducers(state, {type: 'FEED_FETCH_FAILURES_CLEAR'}).fetchFailures).toEqual({})
        })
    })

    describe('action FEED_FETCH_FAILURES_RECEIVED', () => {

        beforeEach(() => {
            action = {
                type: 'FEED_FETCH_FAILURES_RECEIVED',
                links: {self: {path: 'path1', query: {a: 'b', next: 'c'}}},
                failures: [1, 2],
                totalElements: 2
            }
        })

        it('should add feed fetch failures', () => {
            const expectedState = {
                fetchFailures: {
                    failures: [1, 2],
                    links: {
                        self: {
                            path: 'path1', query: {a: 'b', next: 'c'}
                        }
                    },
                    totalElements: 2
                }
            }

            expect(adminReducers(state, action)).toContainObject(expectedState)
        })

        it('should add next page to existing feed fetch failures when self link is the same', () => {
            const currentState = adminReducers(state, action)

            action = {
                ...action,
                links: {self: {path: 'path1', query: {a: 'b', next: 'd'}}},
                failures: [3, 4]
            }

            const expectedState = {
                fetchFailures: {
                    links: {self: {path: 'path1', query: {a: 'b', next: 'd'}}},
                    failures: [1, 2, 3, 4],
                    totalElements: 2
                }
            }

            expect(adminReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should replace existing feed fetch failures when self link is different', () => {
            const currentState = adminReducers(state, action)

            action = {
                ...action,
                links: {self: {path: 'path2', query: {a: 'b', next: 'd'}}},
                failures: [3, 4, 5],
                totalElements: 3
            }

            const expectedState = {
                fetchFailures: {
                    links: {self: {path: 'path2', query: {a: 'b', next: 'd'}}},
                    failures: [3, 4, 5],
                    totalElements: 3
                }
            }

            expect(adminReducers(currentState, action)).toContainObject(expectedState)
        })
    })
})
