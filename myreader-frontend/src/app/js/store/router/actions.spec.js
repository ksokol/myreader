import {createMockStore} from '../../shared/test-utils'
import {routeChange} from '../../store'

describe('src/app/js/store/router/actions.spec.js', () => {

    let store

    beforeEach(() => store = createMockStore())

    describe('action creator routeChange', () => {

        it('should contain expected action type', () => {
            store.dispatch(routeChange())
            expect(store.getActionTypes()).toEqual(['ROUTE_CHANGED'])
        })

        it('should contain expected action data', () => {
            store.dispatch(routeChange(['app', 'bookmarks']))
            expect(store.getActions()[0]).toContainActionData({route: ['app', 'bookmarks'], query: {seenEqual: '*', entryTagEqual: ''}})
        })

        it('should merge query parameter with action data query parameter', () => {
            store.dispatch(routeChange(['app', 'bookmarks'], {entryTagEqual: 'a', b: 'c'}))
            expect(store.getActions()[0]).toContainActionData({route: ['app', 'bookmarks'], query: {seenEqual: '*', entryTagEqual: 'a', b: 'c'}})
        })
    })
})
