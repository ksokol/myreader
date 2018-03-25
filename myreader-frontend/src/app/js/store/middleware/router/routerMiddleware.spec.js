import routerMiddleware from './routerMiddleware'

describe('src/app/js/store/middleware/router/routerMiddleware.spec.js', () => {

    let dispatch, next, routerHandler, state, getState

    beforeEach(() => {
        state = {
            router: {
                a: 'b'
            }
        }

        dispatch = 'expected dispatch'
        getState = () => state
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

    it('should call routerHandler with action and routerState', () => {
        const action = {type: 'ROUTE_CHANGED', payload: 'expected payload'}
        execute(action)

        expect(routerHandler).toHaveBeenCalledWith(jasmine.objectContaining({action, dispatch: 'expected dispatch', routerState: {a: 'b'}}))
    })

    it('should pass copy of router state to routerHandler', done => {
        routerHandler.and.callFake(({action, dispatch, routerState}) => {
            state.router.a = 'c'
            expect(routerState).toEqual({a: 'b'})
            done()
        })

        execute({type: 'ROUTE_CHANGED'})
    })

    it('should pass getState to routerHandler', done => {
        routerHandler.and.callFake(({action, dispatch, routerState, getState}) => {
            expect(getState()).toEqual({router: {a: 'b'}})
            done()
        })

        execute({type: 'ROUTE_CHANGED'})
    })
})
