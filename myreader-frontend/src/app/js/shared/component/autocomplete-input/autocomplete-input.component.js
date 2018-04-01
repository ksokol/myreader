import template from './autocomplete-input.component.html'
import './autocomplete-input.component.css'

class controller {

    constructor($timeout) {
        'ngInject'
        this.$timeout = $timeout
    }

    onSelect() {
        this.mySelectedItem && this.mySelectedItem.length !== 0 ? this.myOnSelect({value: this.mySelectedItem}) : this.myOnClear()
    }

    onChange() {
        this.onFocus()
        this.onSelect()
    }

    onFocus() {
        this.showSuggestions = (this.myValues || []).length > 0
    }

    onBlur() {
        this.$timeout(() => this.showSuggestions = false, 100)
    }

    onSelectSuggestion(term) {
        this.mySelectedItem = term
        this.onSelect()
        this.onBlur()
    }
}

export const AutoCompleteInputComponent = {
    template, controller,
    bindings: {
        myLabel: '<',
        myDisabled: '<',
        mySelectedItem: '<',
        myValues: '<',
        myOnSelect: '&',
        /**
         * @deprecated
         */
        myOnClear: '&'
    }
}
