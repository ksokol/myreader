import template from './validation-message.component.html'
import './validation-message.component.css'

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
