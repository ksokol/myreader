(function () {
    'use strict';

    var utils = require('../../utils');

    function AutoCompleteInputComponent() {
        var ctrl = this;

        ctrl.$onInit = function () {
            if(!ctrl.myLabel) {
                throw new Error('myLabel is undefined');
            }
        };

        ctrl.$onChanges = function (obj) {
            if(obj.myValues) {
                ctrl.values = obj.myValues.currentValue || [];
            }
            if(obj.mySelectedItem && !utils.isEmptyString(obj.mySelectedItem.currentValue)) {
                ctrl.selectedItem = obj.mySelectedItem.currentValue;
            }
        };

        ctrl.filterValues = function(term) {
            var lowerCaseTerm = term.toLowerCase();
            var filteredValues = ctrl.values.filter(function (value) { return value.indexOf(lowerCaseTerm) === 0; });
            return filteredValues.length === 0 ? [term] : filteredValues;
        };

        ctrl.onSelect = function (selectedValue) {
            selectedValue.length !== 0 ? ctrl.myOnSelect({value: selectedValue}) : ctrl.myOnClear();
        };
    }

    require('angular').module('myreader').component('myAutocompleteInput', {
        template: require('./autocomplete-input.component.html'),
        controller: AutoCompleteInputComponent,
        bindings: {
            myLabel: '@',
            myShow: '<',
            mySelectedItem: '<',
            myValues: '<',
            myOnSelect: '&',
            myOnClear: '&'
        }
    });

    module.exports = 'myreader.autocomplete-input.component';

})();
