import template from './entry-content.component.html';
import css from './entry-content.component.css';

class controller {

    constructor($mdMedia, settingsService) {
        'ngInject';
        this.$mdMedia = $mdMedia;
        this.settingsService = settingsService;
    }

    $onInit() {
        this.item = this.myItem || {};
        this.show = this.myShow || false;
    }

    $onChanges(obj) {
        if (obj.myShow) {
            this.show = obj.myShow.currentValue;
        }
    }

    showEntryContent () {
        return this.$mdMedia('gt-md') ? this.settingsService.isShowEntryDetails() || this.show : this.show;
    }
}

export const EntryContentComponent = {
    template, css, controller,
    bindings: {
        myItem: '<',
        myShow: '<'
    }
}
