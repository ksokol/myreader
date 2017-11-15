import template from './settings.component.html';
import css from './settings.component.css';

class controller {

    constructor(settingsService) {
        'ngInject';
        this.settingsService = settingsService;
    }

    $onInit() {
        this.currentSize = this.settingsService.getPageSize();
        this.showUnseenEntries = this.settingsService.isShowUnseenEntries();
        this.showEntryDetails = this.settingsService.isShowEntryDetails();
    }

    save() {
        this.settingsService.setPageSize(this.currentSize);
        this.settingsService.setShowUnseenEntries(this.showUnseenEntries);
        this.settingsService.setShowEntryDetails(this.showEntryDetails);
    }
}

export const SettingsComponent = {
    template, css, controller
};
