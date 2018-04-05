import template from './icon-button.component.html'
import './icon-button.component.css'

export const IconButton = {
    template,
    bindings: {
        myType: '@',
        myColor: '@'
    }
}
