import template from './validation-message.component.html'

class controller {

    $doCheck() {
        if (!this.myInputContainer) {
            return
        }
        Object.keys(this.myFormControl.$error).length > 0
            ? (this.myInputContainer.error = true)
            : (this.myInputContainer.error = false)
    }
}

/**
 * @deprecated
 */
export const ValidationMessageComponent = {
    template,
    controller,
    require: {
        myInputContainer: '?^myInputContainer'
    },
    bindings: {
        myFormControl: '<'
    }
}
