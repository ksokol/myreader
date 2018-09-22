import uiRouterStartTransitionHandler from './uiRouterStartTransitionHandler'

describe('uiRouterStartTransitionHandler', () => {

  let criteria, ngRedux

  beforeEach(() => {
    criteria = {
      to: jest.fn().mockReturnValue({name: 'r1.r2'}),
      params: jest.fn().mockReturnValue({a: 'b', c: 'd'})
    }

    ngRedux = {dispatch: jest.fn()}
  })

  it('should not dispatch route changed action on first route change', () => {
    uiRouterStartTransitionHandler(criteria, ngRedux)

    expect(ngRedux.dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'ROUTE_CHANGED'}))
  })

  it('should retrieve to query values', () => {
    uiRouterStartTransitionHandler(criteria, ngRedux)

    expect(criteria.params).toHaveBeenCalledWith('to')
  })

  it('should dispatch action with given route and query values', () => {
    uiRouterStartTransitionHandler(criteria, ngRedux)

    expect(ngRedux.dispatch).toHaveBeenCalledWith(expect.objectContaining({
      route: ['r1', 'r2'],
      query: {a: 'b', c: 'd'}
    }))
  })

  it('should remove hash tag value from query parameter', () => {
    criteria.params = jest.fn().mockReturnValue({'#': 'unexpected', a: 'b'})
    uiRouterStartTransitionHandler(criteria, ngRedux)

    expect(ngRedux.dispatch).toHaveBeenCalledWith(expect.objectContaining({query: {a: 'b'}}))
  })

  it('should merge given query values with configured route query values', () => {
    criteria.to = jest.fn().mockReturnValue({name: 'app.bookmarks'})
    uiRouterStartTransitionHandler(criteria, ngRedux)

    expect(ngRedux.dispatch).toHaveBeenCalledWith(expect.objectContaining({
      query: {
        seenEqual: '*',
        entryTagEqual: '',
        a: 'b',
        c: 'd'
      }
    }))
  })
})
