import template from './entry-title.component.html';
import css from './entry-title.component.css';

class controller {

    $onInit() {
        this.item = this.myItem;
    }
}

export const EntryTitleComponent = {
    template, css, controller,
    bindings: {
        myItem: '<'
    }
};
