'use strict';

require('../shared/service/settings.service');

function SettingsComponent (settingsService) {
    var ctrl = this;

    ctrl.$onInit = function () {
        ctrl.currentSize = settingsService.getPageSize();
        ctrl.showUnseenEntries = settingsService.isShowUnseenEntries();
        ctrl.showEntryDetails = settingsService.isShowEntryDetails();
    };

    ctrl.save = function() {
        settingsService.setPageSize(ctrl.currentSize);
        settingsService.setShowUnseenEntries(ctrl.showUnseenEntries);
        settingsService.setShowEntryDetails(ctrl.showEntryDetails);
    };

    ctrl.css = require('./settings.component.css');
}

require('angular').module('myreader').component('mySettings', {
    template: require('./settings.component.html'),
    controller: ['settingsService', SettingsComponent]
});
