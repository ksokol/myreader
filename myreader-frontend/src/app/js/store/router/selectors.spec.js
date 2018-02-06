import {routeSelector} from 'store'

describe('src/app/js/store/router/selectors.spec.js', () => {

    let state

    beforeEach(() => {
        state = {
            router: {
                currentRoute: ['a', 'b'],
                query: {a: 'b'}
            }
        }
    })

    it('should return router state', () => {
        expect(routeSelector(state))
            .toContainObject({
                router: {
                    currentRoute: ['a', 'b'],
                    query: {a: 'b'}
                }
            })
    })

    it('should return copy of router state', () => {
        const select = routeSelector(state)
        select.router.query.a = 'c'

        expect(routeSelector(state).router.query).toEqual({a: 'b'})
    })
})
