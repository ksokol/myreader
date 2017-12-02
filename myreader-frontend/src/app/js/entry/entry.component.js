import template from './entry.component.html';
import './entry.component.css';

class controller {

    constructor(subscriptionEntryService) {
        'ngInject';
        this.subscriptionEntryService = subscriptionEntryService;
    }

    updateItem(item) {
        this.subscriptionEntryService.save(item)
        .then(updatedEntry => this.item = updatedEntry)
        .catch(error => this.message = {type: 'error', message: error});
    }

    $onInit() {
        this.item = this.myItem;
    }

    onDismissMessage() {
        this.message = null;
    }

    toggleMore(showMore) {
        this.showMore = showMore;
    }

    onCheck(item) {
        this.updateItem({
            uuid: this.item.uuid,
            seen: item.seen,
            tag: this.item.tag
        });
    }

    onTagUpdate(tag) {
        this.updateItem({
            uuid: this.item.uuid,
            seen: this.item.seen,
            tag: tag
        });
    }
}

export const EntryComponent = {
    template, controller,
    bindings: {
        myItem: '<'
    }
};
