import {applyMiddleware, combineReducers, compose as reduxCompose, createStore} from 'redux'
import thunk from 'redux-thunk'
import {commonReducers} from './common'
import {securityReducers} from './security'
import {getLastSecurityState} from './security/security'
import {isInDevMode, isInProdMode} from '../constants'

function devToolsExtensionCompose() {
  return window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
}

function determineDevToolsComposeFn(enabled) {
  return devToolsExtensionCompose() && enabled ? devToolsExtensionCompose()({}) : null
}

function determineComposeFn(enabled) {
  const devToolsCompose = determineDevToolsComposeFn(enabled)
  return devToolsCompose ? devToolsCompose : reduxCompose
}

function enhancer(enabled) {
  return determineComposeFn(enabled)(applyMiddleware(thunk))
}

const reducers = combineReducers({
  security: securityReducers,
  common: commonReducers
})

function initialState(enabled) {
  return enabled ? {
    security: getLastSecurityState()
  } : {}
}

export default function createApplicationStore(environment) {
  return createStore(
    reducers,
    initialState(isInDevMode(environment) || isInProdMode(environment)),
    enhancer(isInDevMode(environment))
  )
}
