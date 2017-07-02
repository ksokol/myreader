'use strict';

var utils = require('../../../shared/utils');

function AutoCompleteInputComponent($q) {
    var ctrl = this;

    ctrl.valuesLoaded = false;
    ctrl.values = [];

    var cachedValues = function () {
        var deferred = $q.defer();
        deferred.resolve(ctrl.values);
        return deferred.promise;
    };

    var fetchValues = function () {
        if(ctrl.valuesLoaded) {
            return cachedValues();
        }

        var result = ctrl.myAsyncValues();

        if(!utils.isPromise(result)) {
            return cachedValues();
        }

        return result.then(function (data) {
            ctrl.valuesLoaded = true;
            ctrl.values = ctrl.values.concat(data);
            return ctrl.values;
        });
    };

    ctrl.$onInit = function () {
        if(!ctrl.myLabel) {
            throw new Error('myLabel is undefined');
        }
    };

    ctrl.$onChanges = function (obj) {
        if(obj.myValues) {
            ctrl.valuesLoaded = false;
            ctrl.values = obj.myValues.currentValue || [];
        }
        if(obj.mySelectedItem && obj.mySelectedItem.isFirstChange()) {
            ctrl.selectedItem = obj.mySelectedItem.currentValue;
        }
    };

    ctrl.filterValues = function(term) {
        return fetchValues().then(function (values) {
            var lowerCaseTerm = term.toLowerCase();
            var filteredValues = values.filter(function (value) { return value.indexOf(lowerCaseTerm) === 0; });
            return filteredValues.length === 0 ? [term] : filteredValues;
        });
    };

    ctrl.onSelect = function (selectedValue) {
        selectedValue.length !== 0 ? ctrl.myOnSelect({value: selectedValue}) : ctrl.myOnClear();
    };
}

require('angular').module('myreader').component('myAutocompleteInput', {
    template: require('./autocomplete-input.component.html'),
    controller: ['$q', AutoCompleteInputComponent],
    bindings: {
        myLabel: '@',
        myDisabled: '<',
        mySelectedItem: '<',
        myValues: '<',
        myAsyncValues: '&',
        myOnSelect: '&',
        myOnClear: '&'
    }
});
