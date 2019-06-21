import {applyMiddleware, combineReducers, compose as reduxCompose, createStore} from 'redux'
import thunk from 'redux-thunk'
import arrayMiddleware from './middleware/array/arrayMiddleware'
import guardMiddleware from './middleware/guard/guardMiddleware'
import fetchMiddleware from './middleware/fetch'
import {settingsReducers} from './settings'
import {commonReducers} from './common'
import {securityReducers} from './security'
import {entryReducers} from './entry'
import {subscriptionReducers} from './subscription'
import {getLastSecurityState} from './security/security'
import {isInDevMode, isInProdMode} from '../constants'
import {settings} from '../contexts/settings/settings'

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
  return determineComposeFn(enabled)(applyMiddleware(thunk, arrayMiddleware, guardMiddleware, fetchMiddleware))
}

const reducers = combineReducers({
  security: securityReducers,
  common: commonReducers,
  settings: settingsReducers,
  entry: entryReducers,
  subscription: subscriptionReducers
})

function initialState(enabled) {
  return enabled ? {
    security: getLastSecurityState(),
    settings: settings()
  } : {}
}

export default function createApplicationStore(environment) {
  return createStore(
    reducers,
    initialState(isInDevMode(environment) || isInProdMode(environment)),
    enhancer(isInDevMode(environment))
  )
}
