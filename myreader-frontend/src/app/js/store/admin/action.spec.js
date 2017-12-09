import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {rebuildSearchIndex} from './actions'
import {initialState} from '../common/index'
import {PROCESSING} from '../../constants'

describe('src/app/js/store/admin/action.spec.js', () => {

    let store

    beforeEach(() => {
        const mockStore = configureMockStore([thunk])
        store = mockStore({common: initialState()})
    })

    it('action creator rebuildSearchIndex', () => {
        store.dispatch(rebuildSearchIndex())
        expect(store.getActions()[0]).toContainObject({type: 'PUT', url: PROCESSING, body: {process: 'indexSyncJob'}})
    })

    it('action creator rebuildSearchIndex should contain notification action creator in success property', () => {
        const action = store.dispatch(rebuildSearchIndex())
        store.dispatch(action.success())

        expect(store.getActions()[1]).toContainObject({type: 'SHOW_NOTIFICATION', notification: {text: 'Indexing started', type: 'success'}})
    })
})
