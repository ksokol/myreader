import {isBoolean} from '../../shared/utils';

class Settings {

    constructor(json) {
        try {
            this.source = JSON.parse(json) || {};
        } catch (e) {
            this.source = {};
        }
    }

    getPageSize() {
        if (this.source.pageSize > 0 && this.source.pageSize <= 30) {
            return this.source.pageSize;
        }
        return 10;
    }

    setPageSize(pageSize) {
        this.source.pageSize = (pageSize > 0 && pageSize <= 30) ? pageSize : 10;
    }

    isShowEntryDetails() {
        return isBoolean(this.source.showEntryDetails) ? this.source.showEntryDetails : true;
    }

    setShowEntryDetails(showEntryDetails) {
        this.source.showEntryDetails = isBoolean(showEntryDetails) ? showEntryDetails : true;
    }

    isShowUnseenEntries() {
        return isBoolean(this.source.showUnseenEntries) ? this.source.showUnseenEntries : true;
    }

    setShowUnseenEntries(showUnseenEntries) {
        this.source.showUnseenEntries = isBoolean(showUnseenEntries) ? showUnseenEntries : true;
    }

    toJson() {
        return JSON.stringify(this.source);
    }
}

const storageKey = 'myreader-settings';

export class SettingsService {

    constructor() {
        this.settings = new Settings(localStorage.getItem(storageKey));
    }

    persistSettings() {
        localStorage.setItem(storageKey, this.settings.toJson());
    };

    getPageSize() {
        return this.settings.getPageSize();
    }

    isShowUnseenEntries() {
        return this.settings.isShowUnseenEntries();
    }

    isShowEntryDetails() {
        return this.settings.isShowEntryDetails();
    }

    setPageSize(pageSize) {
        this.settings.setPageSize(pageSize);
        this.persistSettings();
    }

    setShowEntryDetails(showEntryDetails) {
        this.settings.setShowEntryDetails(showEntryDetails);
        this.persistSettings();
    }

    setShowUnseenEntries(showUnseenEntries) {
        this.settings.setShowUnseenEntries(showUnseenEntries);
        this.persistSettings();
    }
}
