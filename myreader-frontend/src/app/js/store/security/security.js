import {isBoolean} from '../../shared/utils'
import {redirectToLoginPage, STORAGE_SECURITY_KEY} from '../../constants'
import {readFromStorage, writeToStorage} from '../shared/storage-util'
import {authorizedSelector} from 'store'

const key = STORAGE_SECURITY_KEY

export function getLastSecurityState() {
    const {authorized, role} = readFromStorage(key)
    return {authorized: isBoolean(authorized) ? authorized : false, role: role ? role : ''}
}

export function setLastSecurityState({authorized, role}) {
    writeToStorage(key, {...readFromStorage(key), authorized, role})
}

function createSecurityListener(store) {
    store.subscribe(() => {
        if (!authorizedSelector(store.getState())) {
            redirectToLoginPage()
        }
    })
}

export const installAuthorizationChangeActionDispatcher = store => createSecurityListener(store)
