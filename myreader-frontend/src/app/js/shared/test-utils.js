import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {initialApplicationState} from '../store'

export function createMockStore(middlewares = []) {
  let state = initialApplicationState()
  const store = configureMockStore([thunk, ...middlewares])(() => state)

  store.getActionTypes = () => store.getActions().map(it => it.type)
  store.setState = stateSlice => state = {...state, ...stateSlice}

  return store
}

export function flushPromises() {
  return new Promise(resolve => setImmediate(resolve))
}

export function pending() {
  return jest.fn().mockReturnValue(new Promise(() => {}))
}

export function resolved(value = {}) {
  return jest.fn().mockResolvedValueOnce(value)
}

export function rejected(value = {}) {
  return jest.fn().mockRejectedValueOnce(value)
}
