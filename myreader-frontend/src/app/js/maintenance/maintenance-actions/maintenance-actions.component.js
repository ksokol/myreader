import template from './maintenance-actions.component.html';

class controller {

    constructor(processingService) {
        'ngInject';
        this.processingService = processingService;
    }

    onRefreshIndex() {
        return this.processingService.rebuildSearchIndex();
    }

    onSuccessRefreshIndex() {
        this.message = {type: 'success', message: 'started'};
    }

    onErrorRefreshIndex(error) {
        this.message = {type: 'error', message: error};
    }
}

export const MaintenanceActionsComponent = {
    template, controller
};
