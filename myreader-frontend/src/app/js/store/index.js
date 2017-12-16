import {combineReducers} from 'redux'
import {settingsReducers} from './settings/index'
import {commonReducers} from './common/index'
import {securityReducers} from './security/index'
import {entryReducers} from './entry/index'
import {subscriptionReducers} from './subscription/index'
export {SECURITY_UPDATE} from './security/index'

export const reducers = combineReducers({
    security: securityReducers,
    common: commonReducers,
    settings: settingsReducers,
    entry: entryReducers,
    subscription: subscriptionReducers
})
