import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {initialApplicationState} from '../store'

export function reactComponent(name) {
  function _reactComponentMock($provide) {
    $provide.value(name, props => {
      _reactComponentMock.bindings = {...props}
      return ''
    })
  }

  return _reactComponentMock
}

export function createMockStore(middlewares = []) {
  let state = initialApplicationState()
  const store = configureMockStore([thunk, ...middlewares])(() => state)

  store.getActionTypes = () => store.getActions().map(it => it.type)
  store.setState = stateSlice => state = {...state, ...stateSlice}

  return store
}

export function ngReduxMock() {
  const store = createMockStore()
  const storeDispatch = store.dispatch
  store.dispatch = jest.fn(action => storeDispatch(action))

  const storeSetState = store.setState
  let mapDispatchToTargets = []

  const createMapToTarget = (component, mapStateToTarget) => state =>
    typeof mapStateToTarget === 'function' ? Object.assign(component, mapStateToTarget(state)) : () => null

  store.connect = jest.fn((mapStateToTarget, mapDispatchToTarget) => {
    return component => {
      const fn = createMapToTarget(component, mapStateToTarget)
      fn(store.getState())
      mapDispatchToTargets.push(fn)

      if (typeof mapDispatchToTarget === 'function') {
        Object.assign(component, mapDispatchToTarget(store.dispatch))
      }
      return () => {
      }
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
