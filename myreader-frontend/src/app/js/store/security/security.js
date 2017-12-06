import {isBoolean} from '../../shared/utils';
import {STORAGE_SECURITY_KEY} from '../../constants';
import {readFromStorage, writeToStorage} from '../shared/storage-util';

const key = STORAGE_SECURITY_KEY;

export function getLastSecurityState() {
    const {authorized, role} = readFromStorage(key);
    return {authorized: isBoolean(authorized) ? authorized : false, role: role ? role : ''};
}

export function setLastSecurityState({authorized, role}) {
    writeToStorage(key, {...readFromStorage(key), authorized, role});
}
