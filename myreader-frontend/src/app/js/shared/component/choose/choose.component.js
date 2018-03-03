import template from './choose.component.html'
import './choose.component.css'

export const ChooseComponent = {
    template,
    bindings: {
        myValue: '<',
        myOptions: '<',
        myOnChoose: '&'
    }
}
