import {STORAGE_SECURITY_KEY} from '../../constants'
import {readFromStorage, writeToStorage} from '../../shared/storage-util'

const key = STORAGE_SECURITY_KEY

export function getLastSecurityState() {
  const {authorized} = readFromStorage(key)
  return {
    authorized: typeof authorized === 'boolean' ? authorized : false
  }
}

export function setLastSecurityState({authorized}) {
  writeToStorage(key, {authorized})
}
