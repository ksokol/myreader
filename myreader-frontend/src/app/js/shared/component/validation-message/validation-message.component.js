import template from './validation-message.component.html'
import './validation-message.component.css'

class controller {

    $doCheck() {
        if (!this.isTranscluded) {
            return
        }
        Object.keys(this.myFormControl.$error).length > 0
            ? (this.myInputContainer.error = true)
            : (this.myInputContainer.error = false)
    }

    /**
     * @deprecated
     */
    get isTranscluded() {
        return this.myInputContainer
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
