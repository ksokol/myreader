(function () {
    'use strict';

    function SearchInputComponent() {
        var ctrl = this;

        ctrl.$onInit = function () {
            ctrl.value = ctrl.myValue || '';
        };

        ctrl.$onChanges = function (obj) {
            ctrl.value = obj.myValue.currentValue || '';
        };

        ctrl.isEmpty = function () {
            return ctrl.value.length === 0;
        };

        ctrl.onChange = function () {
            if (ctrl.isEmpty()) {
                ctrl.myOnClear();
            } else {
                ctrl.myOnChange({ value: ctrl.value });
            }
        };

        ctrl.onClear = function () {
            ctrl.value = '';
            ctrl.myOnClear();
        };

        ctrl.css = require('./search-input.component.css');
    }

    require('angular').module('myreader').component('mySearchInput', {
        template: require('./search-input.component.html'),
        controller: SearchInputComponent,
        bindings: {
            myValue: '<',
            myOnChange: '&',
            myOnClear: '&'
        }
    });

})();
