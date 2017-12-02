import template from './validation-message.component.html';
import './validation-message.component.css';

export const ValidationMessageComponent = {
    template,
    bindings: {
        myFormControl: '<'
    }
};
