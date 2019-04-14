import {findRouteConfiguration, routeConfiguration} from './routes'
import {createMockStore} from '../../shared/test-utils'

describe('routes', () => {

  describe('findRouteConfiguration', () => {

    const exampleConfiguration = {
      'parent-route': {
        query: {a: 'b'},
        before: () => ({type: 'BEFORE_PARENT'}),
        resolve: () => ({type: 'RESOLVE_PARENT'}),
        children: {
          'child-route': {
            query: {c: 'd'},
            before: () => ({type: 'BEFORE_CHILD'}),
            resolve: () => ({type: 'RESOLVE_CHILD'})
          }
        }
      }
    }

    it('should return empty route when given route is undefined', () => {
      expect(findRouteConfiguration()).toEqual({route: []})
    })

    it('should return empty route when given route is empty', () => {
      expect(findRouteConfiguration([], exampleConfiguration)).toEqual({route: []})
    })

    it('should return given route with one component when route was not found in route configuration', () => {
      expect(findRouteConfiguration(['some-route'], exampleConfiguration)).toEqual({route: ['some-route']})
    })

    it('should return given route with two components when route was not found in route configuration', () => {
      expect(findRouteConfiguration(['some', 'route'], exampleConfiguration)).toEqual({route: ['some', 'route']})
    })

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

    describe('app', () => {

      beforeEach(() => routeConfig = routeConfiguration['app'])

      it('should contain expected before action(s)', () => {
        expect(routeConfig.before()).toEqualActionType('GET_SUBSCRIPTIONS')
      })
    })
  })
})
