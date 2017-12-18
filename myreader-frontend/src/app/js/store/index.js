import {combineReducers} from 'redux'
import {settingsReducers} from './settings'
import {commonReducers} from './common'
import {securityReducers} from './security'
import {entryReducers} from './entry'
import {subscriptionReducers} from './subscription'

export * from './admin'
export * from './common'
export * from './security'
export * from './settings'
export * from './entry'
export * from './subscription'

export const reducers = combineReducers({
    security: securityReducers,
    common: commonReducers,
    settings: settingsReducers,
    entry: entryReducers,
    subscription: subscriptionReducers
})
