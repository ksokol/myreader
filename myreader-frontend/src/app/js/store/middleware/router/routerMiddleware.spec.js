import routerMiddleware from './routerMiddleware'

describe('src/app/js/store/middleware/router/routerMiddleware.spec.js', () => {

    let dispatch, next, routerHandler, getState

    let routerState = {
        router: {
            a: 'b'
        }
    }

    beforeEach(() => {
        dispatch = 'expected dispatch'
        getState = () => routerState
        next = jasmine.createSpy('next')
        routerHandler = jasmine.createSpy('routerHandler')
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

    it('should call routerHandler with action and router state', () => {
        const action = {type: 'ROUTE_CHANGED', payload: 'expected payload'}
        execute(action)

        expect(routerHandler).toHaveBeenCalledWith({action, dispatch: 'expected dispatch', state: {a: 'b'}})
    })

    it('should pass copy of router state to routerHandler', done => {
        routerHandler.and.callFake(({action, dispatch, state}) => {
            routerState.router.a = 'c'
            expect(state).toEqual({a: 'b'})
            done()
        })

        execute({type: 'ROUTE_CHANGED'})
    })
})
