import {routes, findRouteConfiguration} from './routes'
import {createMockStore} from 'shared/test-utils'
import {SUBSCRIPTION_ENTRIES} from 'constants'

describe('src/app/js/store/router/routes.spec.js', () => {

    let store

    beforeEach(() => store = createMockStore())

    describe('findRouteConfiguration', () => {

        it('should return empty route when given route is undefined', () =>
            expect(findRouteConfiguration()).toEqual({route: []}))

        it('should return empty route when given route is empty', () =>
            expect(findRouteConfiguration([])).toEqual({route: []}))

        it('should return given route with one component when route was not found in route configuration', () =>
            expect(findRouteConfiguration(['r1'])).toEqual({route: ['r1']}))

        it('should return given route with two components when route was not found in route configuration', () =>
            expect(findRouteConfiguration(['r1', 'r2'])).toEqual({route: ['r1', 'r2']}))

        it('should return configured route', () =>
            expect(findRouteConfiguration(['app', 'bookmarks']))
                .toContainObject({route: ['app', 'bookmarks'], query: {seenEqual: '*', entryTagEqual: ''}}))
    })

    describe('route configuration', () => {

        let routeConfig

        describe('bookmarks', () => {

            beforeEach(() => routeConfig = routes['app'].children['bookmarks'])

            it('should return default query values', () => expect(routeConfig.query).toEqual({seenEqual: '*', entryTagEqual: ''}))

            it('should contain expected before actions', () => expect(routeConfig.before()).toEqualActionType('GET_ENTRY_TAGS'))

            it('should contain expected resolve actions', () => {
                store.dispatch(routeConfig.resolve({a: 'b', c: 'd'}))
                expect(store.getActionTypes()).toEqual(['GET_ENTRIES'])
                expect(store.getActions()[0].url).toContain(SUBSCRIPTION_ENTRIES)
                expect(store.getActions()[0].url).toContain('c=d&a=b')
            })
        })
    })
})
