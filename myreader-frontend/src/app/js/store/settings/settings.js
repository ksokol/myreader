import {isBoolean} from '../../shared/utils';
import {STORAGE_SETTINGS_KEY} from '../../constants';
import {readFromStorage, writeToStorage} from '../shared/storage-util';

const key = STORAGE_SETTINGS_KEY;

export function getPageSize() {
    const {pageSize} = readFromStorage(key);
    return (pageSize > 0 && pageSize <= 30) ? pageSize : 10;
}

export function isShowUnseenEntries() {
    const {showUnseenEntries} = readFromStorage(key);
    return isBoolean(showUnseenEntries) ? showUnseenEntries : true;
}

export function isShowEntryDetails() {
    const {showEntryDetails} = readFromStorage(key);
    return isBoolean(showEntryDetails) ? showEntryDetails : true;
}

export function setPageSize(value) {
    writeToStorage(key, {...readFromStorage(key), pageSize: (value > 0 && value <= 30) ? value : 10});
}

export function setShowEntryDetails(value) {
    writeToStorage(key, {...readFromStorage(key), showEntryDetails: isBoolean(value) ? value : true});
}

export function setShowUnseenEntries(value) {
    writeToStorage(key, {...readFromStorage(key), showUnseenEntries: isBoolean(value) ? value : true});
}

export function settings() {
    return {
        pageSize: getPageSize(),
        showUnseenEntries: isShowUnseenEntries(),
        showEntryDetails: isShowEntryDetails()
    }
}
