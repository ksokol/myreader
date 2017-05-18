(function () {
    'use strict';

    function NavigationSubscriptionItemComponent() {
        var ctrl = this;

        ctrl.$onInit = function () {
            ctrl.item = ctrl.myItem || {};
            ctrl.selected = ctrl.mySelected || {};
        };

        ctrl.$onChanges = function (obj) {
            ctrl.selected = obj.mySelected.currentValue;
        };

        ctrl.isSelected = function (item) {
            return ctrl.selected.uuid === item.uuid && ctrl.selected.tag === item.tag;
        };

        ctrl.isOpen = function () {
            return ctrl.selected.tag === ctrl.item.tag;
        };

        ctrl.onSelect = function (tag, uuid) {
            ctrl.myOnSelect({selected: {tag: tag, uuid: uuid}});
        };

        ctrl.isInvisible = function (item) {
            return item.hasOwnProperty('unseen') && item.unseen <= 0;
        };

        ctrl.css = require('./subscription-item.component.css');
    }

    require('angular').module('myreader').component('myNavigationSubscriptionItem', {
        template: require('./subscription-item.component.html'),
        controller: NavigationSubscriptionItemComponent,
        bindings: {
            myItem: '<',
            mySelected: '<',
            myOnSelect: '&'
        }
    });

    module.exports = 'myreader.navigation.subscription-item.component';

})();
