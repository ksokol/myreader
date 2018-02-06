import uiRouterAdapter from './uiRouterAdapter'

describe('src/app/js/shared/router/uiRouterAdapter.spec.js', () => {

    let state, adapter

    beforeEach(() => {
        state = jasmine.createSpyObj('state', ['go'])
        state.go.and.returnValue(Promise.resolve('expected resolved value'))
        adapter = uiRouterAdapter(state)
    })

    it('should pass state name to ui router', () => {
        adapter({route: ['r1']})
        expect(state.go).toHaveBeenCalledWith('r1', undefined)
    })

    it('should pass nested state name to ui router', () => {
        adapter({route: ['r1', 'r2']})
        expect(state.go).toHaveBeenCalledWith('r1.r2', undefined)
    })

    it('should pass query parameters to ui router', () => {
        adapter({route: [''], query: {a: 'b', c: 'd'}})
        expect(state.go).toHaveBeenCalledWith('', {a: 'b', c: 'd'})
    })

    it('should return promise from ui router', done => {
        adapter({route: ['']}).then(actual => {
            expect(actual).toEqual('expected resolved value')
            done()
        })
    })
})
