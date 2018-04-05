import template from './entry-actions.component.html'

class controller {

    toggleMore() {
        this.showMore = !this.showMore
        this.myOnMore({showMore: this.showMore})
    }

    onCheckClick(value) {
        this.myOnCheck({item: {seen: value}})
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
