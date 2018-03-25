import routerHandler from './routerHandler'

describe('src/app/js/store/middleware/router/routerHandler.spec.js', () => {

    let routerAdapter, dispatch

    const execute = (givenAction = {}, givenState = {}, getState = () => {}) => routerHandler(routerAdapter)({action: givenAction, dispatch, routerState: givenState, getState})

    beforeEach(() => {
        routerAdapter = jasmine.createSpy('routerAdapter')
        dispatch = jasmine.createSpy('dispatch')
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
        expect(dispatch.calls.allArgs()).toEqual([[{a: 'b', c: 'd'}], [{a: 'b', e: 'f'}]])
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
        expect(dispatch.calls.allArgs()).toEqual([[{a: 'b'}], [{c: 'd'}]])
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
        expect(dispatch.calls.allArgs()).toEqual([['expected1'], ['expected2'], ['expected3']])
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
        expect(dispatch.calls.allArgs()).toEqual([['expected1'], ['expected2'], ['expected3']])
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
})
