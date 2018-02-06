import initialState from '.'
import {routerReducers} from 'store'

describe('src/app/js/store/entry/reducers.spec.js', () => {

    let state

    beforeEach(() => state = initialState())

    it('initial state', () =>
        expect(routerReducers(state, {type: 'UNKNOWN_ACTION'})).toEqual(initialState()))

    describe('action ROUTE_CHANGED', () => {

        it('should set route', () => {
            const action = {
                type: 'ROUTE_CHANGED',
                route: ['r2', 'r3'],
                query: {c: 'd'}
            }

            const currentState = {currentRoute: ['r1'], query: {a: 'b'}}
            const expectedState = {currentRoute: ['r2', 'r3'], query: {c: 'd'}}

            expect(routerReducers(currentState, action)).toContainObject(expectedState)
        })
    })
})
