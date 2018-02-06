import createRouterMiddleware from '.'

describe('src/app/js/store/middleware/router/index.spec.js', () => {

    it('should create router middleware with given router adapter', () => {
        const routerAdapter = jasmine.createSpy('routerAdapter')
        const dispatch = () => {}
        const getState = () => {return {router: {currentRoute: []}}}
        const next = () => {}
        const action = {type: 'ROUTE_CHANGED'}

        createRouterMiddleware(routerAdapter)({dispatch, getState})(next)(action)
        expect(routerAdapter).toHaveBeenCalled()
    })
})
