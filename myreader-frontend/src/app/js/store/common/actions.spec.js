import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
    fetchEnd,
    fetchStart,
    initialState,
    removeNotification,
    showErrorNotification,
    showSuccessNotification
} from './index'

describe('src/app/js/store/common/actions.spec.js', () => {

    let store

    beforeEach(() => {
        const mockStore = configureMockStore([thunk])
        store = mockStore({common: initialState()})
    })

    it('action creator removeNotification', () => {
        store.dispatch(removeNotification({id: 1}))
        expect(store.getActions()[0]).toContainObject({type: 'REMOVE_NOTIFICATION', id: 1})
    })

    it('action creator showSuccessNotification', () => {
        store.dispatch(showSuccessNotification('expected text'))
        expect(store.getActions()[0])
            .toContainObject({type: 'SHOW_NOTIFICATION', notification: {id: 0, text: 'expected text', type: 'success'}})
    })

    it('action creator showSuccessNotification should trigger action creator removeNotification action after 3 seconds', () => {
        store.dispatch(showSuccessNotification('expected text'))
        jasmine.clock().tick(3000)

        expect(store.getActions()[1]).toContainObject({type: 'REMOVE_NOTIFICATION', id: 0})
    })

    it('action creator showErrorNotification', () => {
        store.dispatch(showErrorNotification('expected text'))

        expect(store.getActions()[0])
            .toContainObject({type: 'SHOW_NOTIFICATION', notification: {id: 0, text: 'expected text', type: 'error'}})
    })

    it('action creator showErrorNotification should trigger action creator removeNotification action after 3 seconds', () => {
        store.dispatch(showErrorNotification('expected text'))
        jasmine.clock().tick(3000)

        expect(store.getActions()[1]).toContainObject({type: 'REMOVE_NOTIFICATION', id: 0})
    })

    it('action creator fetchStart', () => {
        store.dispatch(fetchStart())

        expect(store.getActions()[0]).toContainObject({type: 'FETCH_START'})
    })

    it('action creator fetchEnd', () => {
        store.dispatch(fetchEnd())

        expect(store.getActions()[0]).toContainObject({type: 'FETCH_END'})
    })

    it('action creator fetchEnd with error message', () => {
        store.dispatch(fetchEnd('expected error message'))

        expect(store.getActions()[0])
            .toContainObject({type: 'SHOW_NOTIFICATION', notification: {text: 'expected error message', type: 'error'}})
        expect(store.getActions()[1]).toContainObject({type: 'FETCH_END'})
    })
})