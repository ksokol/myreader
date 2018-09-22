import routerMiddleware from './routerMiddleware'

describe('routerMiddleware', () => {

  let dispatch, next, routerHandler, state, getState

  beforeEach(() => {
    state = {
      router: {
        currentRoute: ['a']
      }
    }

    dispatch = 'expected dispatch'
    getState = () => state
    next = jest.fn()
    routerHandler = jest.fn()
  })

  const execute = action => routerMiddleware(routerHandler)({dispatch, getState})(next)(action)

  it('should dispatch action when action type is not eligible for router middleware', () => {
    execute({type: 'OTHER_ACTION'})

    expect(next).toHaveBeenCalledWith({type: 'OTHER_ACTION'})
    expect(routerHandler).not.toHaveBeenCalled()
  })

  it('should dispatch action when action type is eligible for router middleware', () => {
    const action = {type: 'ROUTE_CHANGED', payload: 'expected payload'}
    execute(action)

    expect(next).toHaveBeenCalledWith(action)
  })

  it('should call routerHandler with action and routerState', () => {
    const action = {type: 'ROUTE_CHANGED', payload: 'expected payload'}
    execute(action)

    expect(routerHandler).toHaveBeenCalledWith(expect.objectContaining({
      action,
      dispatch: 'expected dispatch',
      routerState: {currentRoute: ['a']}
    }))
  })

  it('should pass copy of router state to routerHandler', done => {
    routerHandler.mockImplementationOnce(({action, dispatch, routerState}) => {
      state.router.currentRoute = ['b']
      expect(routerState).toEqual({currentRoute: ['a']})
      done()
    })

    execute({type: 'ROUTE_CHANGED'})
  })

  it('should pass getState to routerHandler', done => {
    routerHandler.mockImplementationOnce(({action, dispatch, routerState, getState}) => {
      expect(getState()).toEqual({router: {currentRoute: ['a']}})
      done()
    })

    execute({type: 'ROUTE_CHANGED'})
  })

  it('should suppress action when routes are equal', () => {
    execute({type: 'ROUTE_CHANGED', route: ['a']})

    expect(next).not.toHaveBeenCalled()
    expect(routerHandler).not.toHaveBeenCalled()
  })

  it('should suppress action when routes and queries are equal', () => {
    state.router.query = {b: 'c'}
    execute({type: 'ROUTE_CHANGED', route: ['a'], query: {b: 'c'}})

    expect(next).not.toHaveBeenCalled()
    expect(routerHandler).not.toHaveBeenCalled()
  })

  it('should not suppress action when reload is true and routes are equal', () => {
    execute({type: 'ROUTE_CHANGED', route: ['a'], options: {reload: true}})

    expect(next).toHaveBeenCalled()
    expect(routerHandler).toHaveBeenCalled()
  })

  it('should not suppress action when reload is true and routes and queries are equal', () => {
    state.router.query = {b: 'c'}
    execute({type: 'ROUTE_CHANGED', route: ['a'], query: {b: 'c'}, options: {reload: true}})

    expect(next).toHaveBeenCalled()
    expect(routerHandler).toHaveBeenCalled()
  })

  it('should not suppress action when routes are not equal', () => {
    execute({type: 'ROUTE_CHANGED', route: ['a', 'b']})

    expect(next).toHaveBeenCalled()
    expect(routerHandler).toHaveBeenCalled()
  })

  it('should not suppress action when queries are not equal', () => {
    state.router.query = {b: 'c'}
    execute({type: 'ROUTE_CHANGED', route: ['a'], query: {b: 'c', d: 'e'}})

    expect(next).toHaveBeenCalled()
    expect(routerHandler).toHaveBeenCalled()
  })
})
