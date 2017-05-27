(function () {
    'use strict';

    require('./entry-content-sanitizer/entry-content-sanitizer.directive');

    function EntryContentComponent($mdMedia, settingsService) {
        var ctrl = this;

        ctrl.$onInit = function () {
            ctrl.item = ctrl.myItem || {};
            ctrl.show = ctrl.myShow || false;
        };

        ctrl.$onChanges = function (obj) {
            if (obj.myShow) {
                ctrl.show = obj.myShow.currentValue;
            }
        };

        ctrl.showEntryContent = function () {
            return $mdMedia('gt-md') ? settingsService.isShowEntryDetails() || ctrl.show : ctrl.show;
        };

        ctrl.css = require('./entry-content.component.css');
    }

    require('angular').module('myreader').component('myEntryContent', {
        template: require('./entry-content.component.html'),
        controller: [ '$mdMedia', 'settingsService', EntryContentComponent ],
        bindings: {
            myItem: '<',
            myShow: '<'
        }
    });

    module.exports = 'myreader.entry.entry-content.component';

})();
