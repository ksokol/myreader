import * as types from 'store/action-types'
import {initialApplicationState} from 'store'

function applicationInfoReceived({state, action}) {
    return {...state, applicationInfo: action.applicationInfo}
}

function securityUpdate({state, action}) {
    return action.authorized ? state : initialApplicationState().admin
}

export function adminReducers(state = initialApplicationState().admin, action) {
    switch (action.type) {
        case types.APPLICATION_INFO_RECEIVED: {
            return applicationInfoReceived({state, action})
        }
        case types.SECURITY_UPDATE: {
            return securityUpdate({state, action})
        }
        default: {
            return state
        }
    }
}
