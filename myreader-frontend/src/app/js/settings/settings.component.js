import template from './settings.component.html';
import css from './settings.component.css';
import {getSettings} from '../store/settings/index';
import {updateSettings} from '../store/settings/settings.actions';

class controller {

    constructor($ngRedux) {
        'ngInject';
        this.$ngRedux = $ngRedux;
        this.unsubscribe = $ngRedux.connect(getSettings)(this);
    }

    $onDestroy() {
        this.unsubscribe();
    }

    save() {
        this.$ngRedux.dispatch(updateSettings({
            pageSize: this.pageSize,
            showUnseenEntries: this.showUnseenEntries,
            showEntryDetails: this.showEntryDetails
        }));
    }
}

export const SettingsComponent = {
    template, css, controller
};
