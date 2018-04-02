import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {initialApplicationState} from 'store'

/*
 * https://velesin.io/2016/08/23/unit-testing-angular-1-5-components/
 */
export function componentMock(name) {
    function _componentMock($provide) {
        _componentMock.bindings = {}

        $provide.decorator(name + 'Directive', function($delegate) {
            const component = $delegate[0]
            component.template = ''
            component.controller = function () {
                _componentMock.bindings = this
            }

            return $delegate
        })
    }

    return _componentMock
}

export function multipleComponentMock(name) {
    multipleComponentMock.bindings = []

    function _componentMock($provide) {
        _componentMock.bindings = multipleComponentMock.bindings

        $provide.decorator(name + 'Directive', function($delegate) {
            const component = $delegate[0]
            component.template = '<ng-transclude></ng-transclude>'
            component.transclude = true
            component.controller = function () {
                multipleComponentMock.bindings.push(this)
            }

            return $delegate
        })
    }

    return _componentMock
}

export function filterMock(name) {
    function _filterMock($provide) {
        const filter = jasmine.createSpy(name + 'Filter')
        filter.and.callFake(function (value) {
            if (typeof value === 'object') {
                // remove Angular specific attributes
                delete value.$$hashKey
                delete value.object
            }
            return name + '(' + JSON.stringify(value) + ')'
        })
        $provide.value(name + 'Filter', filter)
    }

    return _filterMock
}

export function mock(name) {
    function _mock($provide) {
        $provide.value(name, {})
    }
    return _mock
}

export function createMockStore() {
    let state = initialApplicationState()
    const store = configureMockStore([thunk])(() => state)

    store.getActionTypes = () => store.getActions().map(it => it.type)
    store.setState = stateSlice => state = {...state, ...stateSlice}

    return store
}

export function ngReduxMock() {
    const store = createMockStore()
    spyOn(store, 'dispatch')
    store.dispatch.and.callThrough()

    const storeSetState = store.setState
    let mapDispatchToTargets = []

    const createMapToTarget = (component, mapStateToTarget) => state =>
        typeof mapStateToTarget === 'function' ? Object.assign(component, mapStateToTarget(state)) : () => null

    store.connect = jasmine.createSpy('$ngRedux.connect')
    store.connect.and.callFake((mapStateToTarget, mapDispatchToTarget) => {
        return component => {
            const fn = createMapToTarget(component, mapStateToTarget)
            fn(store.getState())
            mapDispatchToTargets.push(fn)

            if (typeof mapDispatchToTarget === 'function') {
                Object.assign(component, mapDispatchToTarget(store.dispatch))
            }
            return () => {}
        }
    })

    store.setState = stateSlice => {
        storeSetState(stateSlice)
        mapDispatchToTargets.forEach(mapDispatchToTarget => mapDispatchToTarget(store.getState()))
    }

    return store
}

export function mockNgRedux() {
    function _mock($provide) {
        $provide.value('$ngRedux', ngReduxMock())
    }
    return _mock
}

export function onKey(type, event, funcs = {}) {
    let keyEvent = document.createEvent('Event')
    keyEvent.keyCode = event.keyCode
    keyEvent.key = event.key
    Object.assign(keyEvent, funcs)

    keyEvent.initEvent(`key${type}`)
    document.dispatchEvent(keyEvent)
}

export function tick(millis = 0) {
    jasmine.clock().tick(millis)
}
