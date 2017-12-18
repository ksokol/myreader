import * as types from 'store/action-types'
import {getLastSecurityState, setLastSecurityState} from './security'

export const updateSecurity = () => {
    const {authorized, role} = getLastSecurityState()
    return {type: types.SECURITY_UPDATE, authorized, role}
}

export const unauthorized = () => {
    setLastSecurityState({authorized: false, role: ''})
    return updateSecurity()
}

export const authorized = ({role}) => {
    setLastSecurityState({authorized: true, role})
    return updateSecurity()
}
