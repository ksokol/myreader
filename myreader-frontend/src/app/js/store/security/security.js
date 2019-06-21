import {isBoolean} from '../../shared/utils'
import {STORAGE_SECURITY_KEY} from '../../constants'
import {readFromStorage, writeToStorage} from '../../shared/storage-util'

const key = STORAGE_SECURITY_KEY

export function getLastSecurityState() {
  const {authorized, roles} = readFromStorage(key)
  return {authorized: isBoolean(authorized) ? authorized : false, roles: roles ? roles : []}
}

export function setLastSecurityState({authorized, roles}) {
  writeToStorage(key, {...readFromStorage(key), authorized, roles})
}
