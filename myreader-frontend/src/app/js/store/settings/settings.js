import {isBoolean} from '../../shared/utils';
import {STORAGE_SETTINGS_KEY} from "../../constants";

export function getPageSize() {
    const {pageSize} = readFromStorage();
    return (pageSize > 0 && pageSize <= 30) ? pageSize : 10;
}

export function isShowUnseenEntries() {
    const {showUnseenEntries} = readFromStorage();
    return isBoolean(showUnseenEntries) ? showUnseenEntries : true;
}

export function isShowEntryDetails() {
    const {showEntryDetails} = readFromStorage();
    return isBoolean(showEntryDetails) ? showEntryDetails : true;
}

export function setPageSize(value) {
    writeToStorage({...readFromStorage(), pageSize: (value > 0 && value <= 30) ? value : 10});
}

export function setShowEntryDetails(value) {
    writeToStorage({...readFromStorage(), showEntryDetails: isBoolean(value) ? value : true});
}

export function setShowUnseenEntries(value) {
    writeToStorage({...readFromStorage(), showUnseenEntries: isBoolean(value) ? value : true});
}

const storage = localStorage;

function readFromStorage() {
    let source = {};
    try {
        source = JSON.parse(storage.getItem(STORAGE_SETTINGS_KEY)) || {};
    } catch (e) {}
    return source;
}

function writeToStorage(object) {
    storage.setItem(STORAGE_SETTINGS_KEY, toJson(object));
}

function toJson(object) {
    return JSON.stringify(object);
}
