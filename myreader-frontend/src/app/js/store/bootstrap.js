import {applyMiddleware, combineReducers, compose  as reduxCompose, createStore} from 'redux'
import thunk from 'redux-thunk'
import fetchMiddleware from './middleware/fetch'
import {adminReducers} from './admin/reducers'
import {settingsReducers} from './settings'
import {commonReducers} from './common'
import {securityReducers} from './security'
import {entryReducers} from './entry'
import {subscriptionReducers} from './subscription'
import {routerReducers} from './router'
import {settings} from './settings/settings'
import {getLastSecurityState} from './security/security'
import {isInDevMode, isInProdMode} from 'constants'

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

function enhancer(enabled, middlewares = []) {
    return determineComposeFn(enabled)(applyMiddleware(thunk, fetchMiddleware, ...middlewares))
}

const reducers = combineReducers({
    router: routerReducers,
    admin: adminReducers,
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

export default function createApplicationStore(environment, actionDispatchers = [], middlewares = []) {
    const store = createStore(
        reducers,
        initialState(isInDevMode(environment) || isInProdMode(environment)),
        enhancer(isInDevMode(environment), middlewares)
    )

    actionDispatchers.forEach(actionDispatcher => actionDispatcher(store))

    return store
}
