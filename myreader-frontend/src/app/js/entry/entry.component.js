import template from './entry.component.html';
import './entry.component.css';
import {showErrorNotification} from '../store/common/index';

class controller {

    constructor($ngRedux, subscriptionEntryService) {
        'ngInject';
        this.subscriptionEntryService = subscriptionEntryService;
        this.$ngRedux = $ngRedux;
    }

    updateItem(item) {
        this.subscriptionEntryService.save(item)
        .then(updatedEntry => this.item = updatedEntry)
        .catch(error => this.$ngRedux.dispatch(showErrorNotification(error)));
    }

    $onInit() {
        this.item = this.myItem;
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
