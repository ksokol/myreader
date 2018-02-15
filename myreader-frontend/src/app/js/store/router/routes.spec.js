import {findRouteConfiguration, routeConfiguration} from './routes'
import {createMockStore} from 'shared/test-utils'

describe('src/app/js/store/router/routes.spec.js', () => {

    describe('findRouteConfiguration', () => {

        const exampleConfiguration = {
            'parent-route': {
                query: {a: 'b'},
                before: () => {return {type: 'BEFORE_PARENT'}},
                resolve: () => {return {type: 'RESOLVE_PARENT'}},
                children: {
                    'child-route': {
                        query: {c: 'd'},
                        before: () => {return {type: 'BEFORE_CHILD'}},
                        resolve: () => {return {type: 'RESOLVE_CHILD'}}
                    }
                }
            }
        }

        it('should return empty route when given route is undefined', () =>
            expect(findRouteConfiguration(), exampleConfiguration).toEqual({route: []}))

        it('should return empty route when given route is empty', () =>
            expect(findRouteConfiguration([], exampleConfiguration)).toEqual({route: []}))

        it('should return given route with one component when route was not found in route configuration', () =>
            expect(findRouteConfiguration(['some-route'], exampleConfiguration)).toEqual({route: ['some-route']}))

        it('should return given route with two components when route was not found in route configuration', () =>
            expect(findRouteConfiguration(['some', 'route'], exampleConfiguration)).toEqual({route: ['some', 'route']}))

        it('should return configured route', () => {
            const route = findRouteConfiguration(['parent-route', 'child-route'], exampleConfiguration)
            expect(route).toContainObject({route: ['parent-route', 'child-route'], query: {c: 'd'}})
            expect(route.before()).toEqual({type: 'BEFORE_CHILD'})
            expect(route.resolve()).toEqual({type: 'RESOLVE_CHILD'})
        })

        it('should return configured route with parent', () => {
            const route = findRouteConfiguration(['parent-route', 'child-route'], exampleConfiguration)
            expect(route.parent).toContainObject({route: ['parent-route'], query: {a: 'b'}})
            expect(route.parent.before()).toEqual({type: 'BEFORE_PARENT'})
            expect(route.parent.resolve()).toEqual({type: 'RESOLVE_PARENT'})
        })
    })

    describe('route configuration', () => {

        let store, routeConfig

        beforeEach(() => store = createMockStore())

        describe('app bookmarks', () => {

            beforeEach(() => routeConfig = routeConfiguration['app'].children['bookmarks'])

            it('should return default query values', () => expect(routeConfig.query).toEqual({seenEqual: '*', entryTagEqual: ''}))

            it('should contain expected before action(s)', () => expect(routeConfig.before()).toEqualActionType('GET_ENTRY_TAGS'))

            it('should contain expected resolve action(s)', () => {
                store.dispatch(routeConfig.resolve({a: 'b', c: 'd'}))
                expect(store.getActionTypes()).toEqual(['GET_ENTRIES'])
                expect(store.getActions()[0].url).toContain('/subscriptionEntries')
                expect(store.getActions()[0].url).toContain('c=d&a=b')
            })
        })

        describe('admin', () => {

            beforeEach(() => routeConfig = routeConfiguration['admin'])

            it('should contain expected before action(s)', () => expect(routeConfig.before()).toEqualActionType('GET_APPLICATION_INFO'))
        })

        describe('admin feed-detail', () => {

            beforeEach(() => routeConfig = routeConfiguration['admin'].children['feed-detail'])

            it('should contain expected before action(s)', () => expect(routeConfig.before()).toEqualActionType('FEED_FETCH_FAILURES_CLEAR'))

            it('should contain expected resolve action(s)', () => {
                store.dispatch(routeConfig.resolve({uuid: 'expectedUuid'}))
                expect(store.getActionTypes()).toEqual(['GET_FEED_FETCH_FAILURES'])
                expect(store.getActions()[0].url).toContain('/feeds/expectedUuid/fetchError')
            })
        })
    })
})
