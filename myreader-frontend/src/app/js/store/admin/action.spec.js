import {rebuildSearchIndex} from 'store'
import {PROCESSING} from '../../constants'
import {createMockStore} from '../../shared/test-utils'

describe('src/app/js/store/admin/action.spec.js', () => {

    let store

    beforeEach(() => store = createMockStore())

    it('action creator rebuildSearchIndex', () => {
        store.dispatch(rebuildSearchIndex())
        expect(store.getActions()[0]).toContainObject({type: 'PUT_INDEX_SYNC_JOB', url: PROCESSING, body: {process: 'indexSyncJob'}})
    })

    it('action creator rebuildSearchIndex should contain notification action creator in success property', () => {
        const action = store.dispatch(rebuildSearchIndex())
        store.dispatch(action.success())

        expect(store.getActions()[1]).toContainObject({type: 'SHOW_NOTIFICATION', notification: {text: 'Indexing started', type: 'success'}})
    })
})
