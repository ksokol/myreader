import template from './choose.component.html'
import './choose.component.css'
import {isObject} from '../../../shared/utils'

class controller {

    getLabel(option) {
        return isObject(option) ? option.label : option
    }

    getValue(option) {
        return isObject(option) ? option.value : option
    }
}

export const ChooseComponent = {
    template, controller,
    bindings: {
        myValue: '<',
        myOptions: '<',
        myOnChoose: '&'
    }
}
