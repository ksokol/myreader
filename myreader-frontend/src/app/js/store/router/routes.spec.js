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

    describe('app entries', () => {

      beforeEach(() => routeConfig = routeConfiguration['app'].children['entries'])

      it('should remove existing entries for store on resolve', () => {
        store.dispatch(routeConfig.resolve[0]())
        expect(store.getActionTypes()).toEqual(['ENTRY_CLEAR'])
      })

      it('should fetch entries for given query on resolve', () => {
        store.dispatch(routeConfig.resolve[1]({query: {a: 'b', c: 'd'}}))
        expect(store.getActionTypes()).toEqual(['GET_ENTRIES'])
        expect(store.getActions()[0].url).toMatch(/\/subscriptionEntries\?seenEqual=false&size=10&c=d&a=b/)
      })
    })

    describe('app subscription', () => {

      beforeEach(() => routeConfig = routeConfiguration['app'].children['subscription'])

      it('should clear edit form on before', () => {
        store.dispatch(routeConfig.before())
        expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CLEAR'])
      })

      it('should load subscription into edit form', () => {
        store.setState({subscription: {subscriptions: [{uuid: 'uuid1'}]}})
        store.dispatch(routeConfig.resolve[0]({query: {uuid: 'uuid1'}}))
        expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_LOAD'])
      })

      it('should fetch subscription before loading into edit form', () => {
        store.dispatch(routeConfig.resolve[0]({query: {}}))
        expect(store.getActionTypes()).toEqual(['GET_SUBSCRIPTION'])
      })

      it('should fetch exclusion patterns for given subscription uuid', () => {
        store.dispatch(routeConfig.resolve[1]({query: {uuid: 'uuid1'}}))
        expect(store.getActionTypes()).toEqual(['GET_SUBSCRIPTION_EXCLUSION_PATTERNS'])
        expect(store.getActions()[0].url).toMatch(/exclusions\/uuid1\/pattern$/)
      })
    })

    describe('app bookmarks', () => {

      beforeEach(() => routeConfig = routeConfiguration['app'].children['bookmarks'])

      it('should return default query values', () => expect(routeConfig.query).toEqual({
        seenEqual: '*',
        entryTagEqual: ''
      }))

      it('should contain expected before action(s)', () => expect(routeConfig.before()).toEqualActionType('GET_ENTRY_TAGS'))

      it('should contain expected resolve action(s)', () => {
        store.dispatch(routeConfig.resolve({query: {a: 'b', c: 'd'}}))
        expect(store.getActionTypes()).toEqual(['GET_ENTRIES'])
        expect(store.getActions()[0].url).toContain('/subscriptionEntries')
        expect(store.getActions()[0].url).toContain('c=d&a=b')
      })
    })

    describe('admin', () => {

      beforeEach(() => routeConfig = routeConfiguration['admin'])

      it('should contain expected before action(s)', () => expect(routeConfig.before()).toEqualActionType('GET_APPLICATION_INFO'))
    })

    describe('admin feed', () => {

      beforeEach(() => routeConfig = routeConfiguration['admin'].children['feed'])

      it('should contain expected resolve action(s)', () => {
        store.dispatch(routeConfig.resolve())
        expect(store.getActionTypes()).toEqual(['GET_FEEDS'])
      })
    })

    describe('admin feed-detail', () => {

      beforeEach(() => routeConfig = routeConfiguration['admin'].children['feed-detail'])

      it('should contain expected before action(s)', () => {
        routeConfig.before.forEach(action => store.dispatch(action()))

        expect(store.getActionTypes()).toEqual(['FEED_CLEAR', 'FEED_FETCH_FAILURES_CLEAR'])
      })

      it('should contain expected resolve action(s)', () => {
        routeConfig.resolve.forEach(action => store.dispatch(action({query: {uuid: 'expectedUuid'}})))
        expect(store.getActionTypes()).toEqual(['GET_FEED', 'GET_FEED_FETCH_FAILURES'])
        expect(store.getActions()[0].url).toMatch(/\/feeds\/expectedUuid$/)
        expect(store.getActions()[1].url).toMatch(/\/feeds\/expectedUuid\/fetchError$/)
      })
    })

    describe('logout', () => {

      beforeEach(() => routeConfig = routeConfiguration['logout'])

      it('should contain expected resolve action(s)', () => {
        store.dispatch(routeConfig.resolve())

        expect(store.getActionTypes()).toEqual(['POST_LOGOUT'])
      })
    })
  })
})
