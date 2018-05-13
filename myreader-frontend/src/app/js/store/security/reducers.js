import * as types from '../../store/action-types'
import {initialApplicationState} from '../../store'

export function securityReducers(state = initialApplicationState().security, action) {
    switch (action.type) {
        case types.SECURITY_UPDATE: {
            const {authorized, role} = action
            return {...state, authorized, role}
        }
        default: {
            return state
        }
    }
}
