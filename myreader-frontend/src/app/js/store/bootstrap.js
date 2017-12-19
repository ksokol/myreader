import {applyMiddleware, combineReducers, compose  as reduxCompose, createStore} from 'redux'
import thunk from 'redux-thunk'
import fetchMiddleware from './middleware/fetch'
import {settingsReducers} from './settings'
import {commonReducers} from './common'
import {securityReducers} from './security'
import {entryReducers} from './entry'
import {subscriptionReducers} from './subscription'
import {getAuthorized} from 'store'
import {settings} from './settings/settings'
import {getLastSecurityState} from './security/security'
import {redirectToLoginPage} from '../constants'

function isInProdMode(environment) {
    return 'production' === environment
}

function isInDevMode(environment) {
    return 'development' === environment
}

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
    return determineComposeFn(enabled)(applyMiddleware(thunk, fetchMiddleware))
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

function createSubscriptions(store) {
    store.subscribe(() => {
        if (!getAuthorized(store.getState())) {
            redirectToLoginPage()
        }
    })
}

export default function createApplicationStore(environment) {
    const store = createStore(
        reducers,
        initialState(isInDevMode(environment) || isInProdMode(environment)),
        enhancer(isInDevMode(environment))
    )

    createSubscriptions(store)

    return store
}
