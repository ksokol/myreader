import template from './search-input.component.html'
import './search-input.component.css'

class controller {

    $onInit() {
        this.value = this.myValue || ''
    }

    $onChanges(obj) {
        this.value = obj.myValue.currentValue || ''
    }

    onChange() {
        this.myOnChange({value: this.value})
    }
}

export const SearchInputComponent = {
    template, controller,
    bindings: {
        myValue: '<',
        myOnChange: '&'
    }
}
