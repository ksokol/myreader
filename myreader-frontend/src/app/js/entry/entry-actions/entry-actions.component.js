import template from './entry-actions.component.html';

class controller {

    $onInit() {
        this.item = this.myItem;
    }

    $onChanges(obj) {
        this.item = obj.myItem.currentValue;
    }

    toggleMore() {
        this.showMore = !this.showMore;
        this.myOnMore({showMore: this.showMore});
    }

    onCheckClick(value) {
        this.myOnCheck({item: {seen: value}});
    }
}

export const EntryActionsComponent = {
    template, controller,
    bindings: {
        myItem: '<',
        myOnMore: '&',
        myOnCheck: '&'
    }
}
