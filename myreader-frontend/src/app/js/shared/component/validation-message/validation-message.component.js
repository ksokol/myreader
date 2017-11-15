import template from './validation-message.component.html';
import css from './validation-message.component.css';

export const ValidationMessageComponent = {
    template, css,
    bindings: {
        myFormControl: '<'
    }
};
