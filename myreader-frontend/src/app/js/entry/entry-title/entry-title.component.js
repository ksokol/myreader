(function () {
    'use strict';

    function EntryTitleComponent() {
        var ctrl = this;

        ctrl.$onInit = function () {
            ctrl.item = ctrl.myItem;
        };

        ctrl.css = require('./entry-title.component.css');
    }

    require('angular').module('myreader').component('myEntryTitle', {
        template: require('./entry-title.component.html'),
        controller: EntryTitleComponent,
        bindings: {
            myItem: '<'
        }
    });

    module.exports = 'myreader.entry.entry-title.component';

})();
