(function () {
    'use strict';

    function EntryActionsComponent() {
        var ctrl = this;

        ctrl.$onInit = function () {
            ctrl.item = ctrl.myItem;
        };

        ctrl.$onChanges = function (obj) {
            ctrl.item = obj.myItem.currentValue;
        };

        ctrl.toggleMore = function () {
            ctrl.showMore = !ctrl.showMore;
            ctrl.myOnMore({showMore: ctrl.showMore});
        };

        ctrl.onCheckClick = function (value) {
            ctrl.myOnCheck({item: { seen: value}});
        };
    }

    require('angular').module('myreader').component('myEntryActions', {
        template: require('./entry-actions.component.html'),
        controller: EntryActionsComponent,
        bindings: {
            myItem: '<',
            myOnMore: '&',
            myOnCheck: '&'
        }
    });

    module.exports = 'myreader.entry.entry-actions.component';

})();
