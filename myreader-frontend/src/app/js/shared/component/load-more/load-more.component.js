import template from './load-more.component.html';

class controller {

    $onChanges(obj) {
        this.disabled = false;
        this.next = obj.myNext.currentValue;
    }

    onClick() {
        this.disabled = true;
        this.myOnMore({more: this.next});
    }
}

export const LoadMoreComponent = {
    template, controller,
    bindings: {
        myNext: '<',
        myOnMore: '&'
    }
};
