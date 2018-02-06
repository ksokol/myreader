import uiRouterStartTransitionHandler from './uiRouterStartTransitionHandler'

describe('src/app/js/shared/router/uiRouterStartTransitionHandler.spec.js', () => {

    let criteria, ngRedux

    beforeEach(() => {
        criteria = jasmine.createSpyObj('criteria', ['to', 'from', 'params'])
        criteria.to.and.returnValue({name: 'r1.r2'})
        criteria.from.and.returnValue({name: ''})
        criteria.params.and.returnValue({a: 'b', c: 'd'})

        ngRedux = jasmine.createSpyObj('$ngRedux', ['dispatch'])
    })

    it('should not dispatch route changed action on first route change', () => {
        uiRouterStartTransitionHandler(criteria, ngRedux)

        expect(ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({type: 'ROUTE_CHANGED'}))
    })

    it('should dispatch route changed action on subsequent route changes', () => {
        criteria.from.and.returnValue({name: 'r2.r1'})
        uiRouterStartTransitionHandler(criteria, ngRedux)

        expect(ngRedux.dispatch).not.toHaveBeenCalled()
    })

    it('should retrieve to query values', () => {
        uiRouterStartTransitionHandler(criteria, ngRedux)

        expect(criteria.params).toHaveBeenCalledWith('to')
    })

    it('should dispatch action with given route and query values', () => {
        uiRouterStartTransitionHandler(criteria, ngRedux)

        expect(ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({route: ['r1', 'r2'], query: {a: 'b', c: 'd'}}))
    })

    it('should remove hash tag value from query parameter', () => {
        criteria.params.and.returnValue({'#': 'unexpected', a: 'b'})
        uiRouterStartTransitionHandler(criteria, ngRedux)

        expect(ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({query: {a: 'b'}}))
    })

    it('should merge given query values with configured route query values', () => {
        criteria.to.and.returnValue({name: 'app.bookmarks'})
        uiRouterStartTransitionHandler(criteria, ngRedux)

        expect(ngRedux.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({query: {seenEqual: '*', entryTagEqual: '', a: 'b', c: 'd'}}))
    })
})
