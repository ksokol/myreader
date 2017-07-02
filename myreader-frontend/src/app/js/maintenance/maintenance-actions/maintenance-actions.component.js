'use strict';

require('./processing.service');
require('../../shared/component/button-group/button-group.component');
require('../../shared/component/button/button.component');
require('../../shared/component/notification-panel/notification-panel.component');

function MaintenanceAtionsComponent(processingService) {
    var ctrl = this;

    ctrl.onRefreshIndex = function() {
        return processingService.rebuildSearchIndex();
    };

    ctrl.onSuccessRefreshIndex = function() {
        ctrl.message = { type: 'success', message: 'started' };
    };

    ctrl.onErrorRefreshIndex = function(data) {
        ctrl.message = { type: 'error', message: data };
    };
}

require('angular').module('myreader').component('myMaintenanceActions', {
    template: require('./maintenance-actions.component.html'),
    controller: ['processingService', MaintenanceAtionsComponent]
});
