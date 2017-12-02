import template from './entry-title.component.html';
import './entry-title.component.css';

class controller {

    $onInit() {
        this.item = this.myItem;
    }
}

export const EntryTitleComponent = {
    template, controller,
    bindings: {
        myItem: '<'
    }
};
