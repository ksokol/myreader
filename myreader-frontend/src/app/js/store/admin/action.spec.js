import {rebuildSearchIndex, applicationInfoReceived, fetchApplicationInfo} from 'store'
import {createMockStore} from '../../shared/test-utils'

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
})
