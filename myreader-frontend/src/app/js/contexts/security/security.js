import {STORAGE_SECURITY_KEY} from '../../constants'
import {readFromStorage, writeToStorage} from '../../shared/storage-util'

const key = STORAGE_SECURITY_KEY

export function getLastSecurityState() {
  const {passwordHash} = readFromStorage(key)
  return {
    passwordHash: passwordHash ?? null
  }
}

export function setLastSecurityState({passwordHash}) {
  writeToStorage(key, {passwordHash})
}
