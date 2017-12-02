import template from './entry-content.component.html';
import './entry-content.component.css';
import {getSettings} from '../../store/settings/index';

class controller {

    constructor($mdMedia, $ngRedux) {
        'ngInject';
        this.$mdMedia = $mdMedia;
        this.unsubscribe = $ngRedux.connect(getSettings)(this);
    }

    $onInit() {
        this.item = this.myItem || {};
        this.show = this.myShow || false;
    }

    $onDestroy() {
        this.unsubscribe();
    }

    $onChanges(obj) {
        if (obj.myShow) {
            this.show = obj.myShow.currentValue;
        }
    }

    showEntryContent () {
        return this.$mdMedia('gt-md') ? this.showEntryDetails || this.show : this.show;
    }
}

export const EntryContentComponent = {
    template, controller,
    bindings: {
        myItem: '<',
        myShow: '<'
    }
};
