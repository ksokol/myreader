import routerHandler from './routerHandler'

describe('src/app/js/store/middleware/router/routerHandler.spec.js', () => {

    let routerAdapter, dispatch

    const execute = (givenAction = {}, givenState = {}) => routerHandler(routerAdapter)({action: givenAction, dispatch, state: givenState})

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
            resolve: query => {
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
                query => {
                    return {...query, c: 'd'}
                },
                query => {
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
})
