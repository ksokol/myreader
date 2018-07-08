import template from './chips-input.component.html'

class controller {

    $onInit() {
        this.model = ''
    }

    onKeyUp(event) {
        if (event.keyCode !== 13) {
            return;
        }
        if (this.model.length > 0) {
            this.myOnChange({value: this.model})
            this.model = ''
        }
    }
}

/**
 * @deprecated
 */
export const ChipsInputComponent = {
    template, controller,
    bindings: {
        myPlaceholder: '<',
        myDisabled: '<',
        myOnChange: '&'
    }
}
