import routerHandler from './routerHandler'

describe('routerHandler', () => {

  let routerAdapter, dispatch

  const execute = (givenAction = {}, givenState = {}, getState = () => {}) =>
    routerHandler(routerAdapter)({action: givenAction, dispatch, routerState: givenState, getState})

  beforeEach(() => {
    routerAdapter = jest.fn()
    dispatch = jest.fn()
  })

  it('should not dispatch any actions when before and resolve are undefined', () => {
    execute()
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should pass action to router adapter', () => {
    execute({type: 'expected'})
    expect(routerAdapter).toHaveBeenCalledWith({type: 'expected'})
  })

  it('should dispatch one resolve action object', () => {
    const action = {
      resolve: ({query}) => {
        return {...query, c: 'd'}
      },
      query: {a: 'b'}
    }

    execute(action)
    expect(dispatch).toHaveBeenCalledWith({a: 'b', c: 'd'})
  })

  it('should dispatch resolve actions array', () => {
    const action = {
      resolve: [
        ({query}) => {
          return {...query, c: 'd'}
        },
        ({query}) => {
          return {...query, e: 'f'}
        }
      ],
      query: {a: 'b'}
    }

    execute(action)
    expect(dispatch.mock.calls).toEqual([[{a: 'b', c: 'd'}], [{a: 'b', e: 'f'}]])
  })

  it('should dispatch one before action object', () => {
    const action = {
      before: () => {
        return {a: 'b'}
      },
      route: ['r1']
    }

    execute(action, {currentRoute: ['r2']})
    expect(dispatch).toHaveBeenCalledWith({a: 'b'})
  })

  it('should dispatch before actions array', () => {
    const action = {
      before: [
        () => {
          return {a: 'b'}
        },
        () => {
          return {c: 'd'}
        }
      ],
      route: ['r1']
    }

    execute(action, {currentRoute: ['r2']})
    expect(dispatch.mock.calls).toEqual([[{a: 'b'}], [{c: 'd'}]])
  })

  it('should not dispatch before action when current route equals new route', () => {
    const action = {
      before: () => null,
      route: ['r']
    }

    execute(action, {currentRoute: ['r']})
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should always dispatch resolve action', () => {
    const action = {
      resolve: () => 'expected',
      route: ['r']
    }

    execute(action, {currentRoute: ['r']})
    expect(dispatch).toHaveBeenCalledWith('expected')
  })

  it('should dispatch resolve action of parent route', () => {
    const action = {
      route: ['r1', 'r2'],
      parent: {
        route: ['r1'],
        resolve: () => 'expected'
      }
    }

    execute(action, {currentRoute: ['r']})
    expect(dispatch).toHaveBeenCalledWith('expected')
  })

  it('should dispatch before action of parent route', () => {
    const action = {
      route: ['r1', 'r2'],
      parent: {
        route: ['r1'],
        before: () => 'expected'
      }
    }

    execute(action, {currentRoute: ['r']})
    expect(dispatch).toHaveBeenCalledWith('expected')
  })

  it('should dispatch resolve action of parent route when current route equals new route', () => {
    const action = {
      route: ['r1', 'r2'],
      parent: {
        route: ['r1'],
        resolve: () => 'expected'
      }
    }

    execute(action, {currentRoute: ['r1', 'r2']})
    expect(dispatch).toHaveBeenCalledWith('expected')
  })

  it('should not dispatch before action of parent route when current route equals new route', () => {
    const action = {
      route: ['r1', 'r2'],
      parent: {
        route: ['r1'],
        before: () => null
      }
    }

    execute(action, {currentRoute: ['r1', 'r2']})
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should dispatch resolve action of all parent routes', () => {
    const action = {
      route: ['r1', '2', 'r3'],
      resolve: () => 'expected3',
      parent: {
        route: ['r1', 'r2'],
        resolve: () => 'expected2',
        parent: {
          route: ['r1'],
          resolve: () => 'expected1'
        }
      }
    }

    execute(action, {currentRoute: ['r']})
    expect(dispatch.mock.calls).toEqual([['expected1'], ['expected2'], ['expected3']])
  })

  it('should dispatch before action of all parent routes', () => {
    const action = {
      route: ['r1', '2', 'r3'],
      before: () => 'expected3',
      parent: {
        route: ['r1', 'r2'],
        before: () => 'expected2',
        parent: {
          route: ['r1'],
          before: () => 'expected1'
        }
      }
    }

    execute(action, {currentRoute: ['r']})
    expect(dispatch.mock.calls).toEqual([['expected1'], ['expected2'], ['expected3']])
  })

  it('should pass getState to resolve action', () => {
    const action = {
      resolve: ({query, getState}) => {
        return {...getState(), c: 'd'}
      }
    }

    execute(action, {}, () => ({a: 'b'}))
    expect(dispatch).toHaveBeenCalledWith({a: 'b', c: 'd'})
  })

  it('should pass getState to before action', () => {
    const action = {
      before: ({query, getState}) => {
        return {...getState(), c: 'd'}
      }
    }

    execute(action, {}, () => ({a: 'b'}))
    expect(dispatch).toHaveBeenCalledWith({a: 'b', c: 'd'})
  })

  it('should dispatch redirect action and should call routerAdapter', () => {
    const action = {
      redirect: () => ({type: 'REDIRECT'}),
      resolve: () => ({type: 'RESOLVE'})
    }

    execute(action)
    expect(dispatch).toHaveBeenCalledWith({type: 'REDIRECT'})
    expect(routerAdapter).not.toHaveBeenCalled()
  })

  it('should dispatch resolve action and should call routerAdapter when function redirect returns an undefined value', () => {
    const action = {
      redirect: () => undefined,
      resolve: () => ({type: 'RESOLVE', query: {a: 'b'}})
    }

    execute(action)
    expect(dispatch).toHaveBeenCalledWith({type: 'RESOLVE', query: {a: 'b'}})
    expect(routerAdapter).toHaveBeenCalled()
  })

  it('should pass functions dispatch and getState to redirect function', () => {
    const getState = () => undefined

    const action = {
      redirect: jest.fn()
    }

    execute(action, {}, getState)
    expect(action.redirect).toHaveBeenCalledWith({dispatch, getState})
  })

  it('should dispatch parent`s redirect action and should call routerAdapter', () => {
    const action = {
      parent: {
        redirect: () => ({type: 'REDIRECT'}),
        resolve: () => ({type: 'RESOLVE'})
      }
    }

    execute(action)
    expect(dispatch).toHaveBeenCalledWith({type: 'REDIRECT'})
    expect(routerAdapter).not.toHaveBeenCalled()
  })

  it('should dispatch parent`s resolve action and should call routerAdapter when parent`s function redirect returns an undefined value', () => {
    const action = {
      parent: {
        redirect: () => undefined,
        resolve: () => ({type: 'RESOLVE', query: {a: 'b'}})
      }
    }

    execute(action)
    expect(dispatch).toHaveBeenCalledWith({type: 'RESOLVE', query: {a: 'b'}})
    expect(routerAdapter).toHaveBeenCalled()
  })

  it('should pass functions dispatch and getState to parent`s redirect function', () => {
    const getState = () => undefined

    const action = {
      parent: {
        redirect: jest.fn()
      }
    }

    execute(action, {}, getState)
    expect(action.parent.redirect).toHaveBeenCalledWith({dispatch, getState})
  })

  it('should always dispatch current route redirect action when defined', () => {
    const action = {
      redirect: () => ({type: 'REDIRECT'}),
      resolve: () => ({type: 'RESOLVE'}),
      parent: {
        redirect: () => ({type: 'REDIRECT_PARENT'}),
        resolve: () => ({type: 'RESOLVE_PARENT'})
      }
    }

    execute(action)
    expect(dispatch).toHaveBeenCalledWith({type: 'REDIRECT'})
  })

  it('should prefer dispatch parent`s redirect action when defined', () => {
    const action = {
      redirect: () => undefined,
      resolve: () => ({type: 'RESOLVE'}),
      parent: {
        redirect: () => ({type: 'REDIRECT_PARENT'}),
        resolve: () => ({type: 'RESOLVE_PARENT'}),
      }
    }

    execute(action)
    expect(dispatch).toHaveBeenCalledWith({type: 'REDIRECT_PARENT'})
  })
})
