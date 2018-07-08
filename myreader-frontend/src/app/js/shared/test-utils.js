import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {initialApplicationState} from '../store'
import ShallowRenderer from 'react-test-renderer/shallow'

/*
 * https://velesin.io/2016/08/23/unit-testing-angular-1-5-components/
 */
export function componentMock(name) {
  function _componentMock($provide) {
    _componentMock.bindings = {}

    $provide.decorator(name + 'Directive', function ($delegate) {
      const component = $delegate[0]
      component.template = '<ng-transclude></ng-transclude>'
      component.transclude = true
      component.controller = function () {
        _componentMock.bindings = this
      }

      return $delegate
    })
  }

  return _componentMock
}

export function reactComponent(name) {
  function _reactComponentMock($provide) {
    $provide.value(name, props => {
      _reactComponentMock.bindings = {...props}
      return ''
    })
  }

  return _reactComponentMock
}

export function multipleComponentMock(name) {
  multipleComponentMock.bindings = []

  function _componentMock($provide) {
    _componentMock.bindings = multipleComponentMock.bindings

    $provide.decorator(name + 'Directive', function ($delegate) {
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
    const filter = jest.fn(value => {
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

export function onKey(type, event, funcs = {}) {
  let keyEvent = document.createEvent('Event')
  keyEvent.keyCode = event.keyCode
  keyEvent.key = event.key
  Object.assign(keyEvent, funcs)

  keyEvent.initEvent(`key${type}`)
  document.dispatchEvent(keyEvent)
}

export function dispatchKeyEventOnElement(element, {type, event, funcs = {}}) {
  let keyEvent = document.createEvent('Event')
  keyEvent.keyCode = event.keyCode
  keyEvent.key = event.key
  Object.assign(keyEvent, funcs)

  keyEvent.initEvent(`key${type}`)
  element.dispatchEvent(keyEvent)
}

export function tick(millis = 0) {
  jest.advanceTimersByTime(millis)
}

/**
 * @deprecated Use {@link shallow(Component)} instead.
 */
export function shallowInstance(Component) {
  const renderer = new ShallowRenderer()
  renderer.render(Component)
  return renderer
}

/**
 * @deprecated Use {@link shallow(Component)} instead.
 */
export function shallowOutput(Component) {
  return shallowInstance(Component).getRenderOutput()
}

export function shallow(Component) {
  const renderer = new ShallowRenderer()
  renderer.render(Component)
  return {
    output: () => renderer.getRenderOutput()
  }
}
