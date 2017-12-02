import template from './search-input.component.html';
import './search-input.component.css';

class controller {

    $onInit() {
        this.value = this.myValue || '';
    }

    $onChanges(obj) {
        this.value = obj.myValue.currentValue || '';
    }

    isEmpty() {
        return this.value.length === 0;
    }

    onChange() {
        if (this.isEmpty()) {
            this.myOnClear();
        } else {
            this.myOnChange({value: this.value});
        }
    }

    onClear() {
        this.value = '';
        this.myOnClear();
    }
}

export const SearchInputComponent = {
    template, controller,
    bindings: {
        myValue: '<',
        myOnChange: '&',
        myOnClear: '&'
    }
};
