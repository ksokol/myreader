import template from './subscription-item.component.html';
import './subscription-item.component.css';

class controller {

    $onInit() {
        this.item = this.myItem || {};
        this.selected = this.mySelected || {};
    }

    $onChanges(obj) {
        this.selected = obj.mySelected.currentValue;
    }

    isSelected(item) {
        return this.selected.uuid === item.uuid && this.selected.tag === item.tag;
    }

    isOpen() {
        return this.selected.tag === this.item.tag;
    }

    onSelect(tag, uuid) {
        this.myOnSelect({selected: {tag, uuid}});
    }

    isInvisible(item) {
        return item.hasOwnProperty('unseen') && item.unseen <= 0;
    }
}

export const NavigationSubscriptionItemComponent = {
    template, controller,
    bindings: {
        myItem: '<',
        mySelected: '<',
        myOnSelect: '&'
    }
};
