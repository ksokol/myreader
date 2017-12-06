import template from './settings.component.html';
import './settings.component.css';
import {getSettings, updateSettings} from '../store/settings/index';

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
    template, controller
};
