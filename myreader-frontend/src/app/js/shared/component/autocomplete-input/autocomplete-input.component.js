import template from './autocomplete-input.component.html';
import {isPromise} from '../../../shared/utils';

class controller {

    constructor($q) {
        'ngInject';
        this.$q = $q;
        this.valuesLoaded = false;
        this.values = [];
    }

    cachedValues() {
        const deferred = this.$q.defer();
        deferred.resolve(this.values);
        return deferred.promise;
    }

    fetchValues() {
        if(this.valuesLoaded) {
            return this.cachedValues();
        }

        const result = this.myAsyncValues();

        if(!isPromise(result)) {
            return this.cachedValues();
        }

        return result.then(data => {
            this.valuesLoaded = true;
            this.values = this.values.concat(data);
            return this.values;
        });
    }

    $onInit() {
        if(!this.myLabel) {
            throw new Error('myLabel is undefined');
        }
    }

    $onChanges(obj) {
        if(obj.myValues) {
            this.valuesLoaded = false;
            this.values = obj.myValues.currentValue || [];
        }
        if(obj.mySelectedItem && obj.mySelectedItem.isFirstChange()) {
            this.selectedItem = obj.mySelectedItem.currentValue;
        }
    }

    filterValues(term) {
        return this.fetchValues().then(values => {
            const lowerCaseTerm = term.toLowerCase();
            const filteredValues = values.filter(value => value.indexOf(lowerCaseTerm) === 0);
            return filteredValues.length === 0 ? [term] : filteredValues;
        });
    }

    onSelect(selectedValue) {
        selectedValue.length !== 0 ? this.myOnSelect({value: selectedValue}) : this.myOnClear();
    }
}

export const AutoCompleteInputComponent = {
    template, controller,
    bindings: {
        myLabel: '@',
        myDisabled: '<',
        mySelectedItem: '<',
        myValues: '<',
        myAsyncValues: '&',
        myOnSelect: '&',
        myOnClear: '&'
    }
};
