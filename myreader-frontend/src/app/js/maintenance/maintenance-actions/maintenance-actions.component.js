import template from './maintenance-actions.component.html';
import {showErrorNotification, showSuccessNotification} from '../../store/common/index';

class controller {

    constructor($ngRedux, processingService) {
        'ngInject';
        this.$ngRedux = $ngRedux;
        this.processingService = processingService;
    }

    onRefreshIndex() {
        return this.processingService.rebuildSearchIndex();
    }

    onSuccessRefreshIndex(text) {
        this.$ngRedux.dispatch(showSuccessNotification(text));
    }

    onErrorRefreshIndex(error) {
        this.$ngRedux.dispatch(showErrorNotification(error));
    }
}

export const MaintenanceActionsComponent = {
    template, controller
};
