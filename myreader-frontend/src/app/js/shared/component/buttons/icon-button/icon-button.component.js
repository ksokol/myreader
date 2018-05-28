import template from './icon-button.component.html'
import './icon-button.component.css'

class controller {

    get props() {
        return {
            type: this.myType,
            color: this.myColor
        }
    }
}

export const IconButton = {
    template, controller,
    bindings: {
        myType: '@',
        myColor: '@'
    }
}
