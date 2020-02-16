import {STORAGE_SECURITY_KEY} from '../../constants'
import {readFromStorage, writeToStorage} from '../../shared/storage-util'

const key = STORAGE_SECURITY_KEY

export function getLastSecurityState() {
  const {roles} = readFromStorage(key)
  return {
    roles: Array.isArray(roles) ? roles : []
  }
}

export function setLastSecurityState({roles}) {
  writeToStorage(key, {roles})
}
