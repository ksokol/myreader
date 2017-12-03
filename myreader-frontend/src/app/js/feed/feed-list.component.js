import template from './feed-list.component.html';
import './feed-list.component.css';
import {showErrorNotification} from "../store/common/common.actions";

class controller {

    constructor($state, $ngRedux, feedService) {
        'ngInject';
        this.$state = $state;
        this.$ngRedux = $ngRedux;
        this.feedService = feedService;
    }

    $onInit() {
        this.feedService.findAll()
            .then(data => this.feeds = data)
            .catch(error => this.$ngRedux.dispatch(showErrorNotification(error)));
    }

    open(feed) {
        this.$state.go('admin.feed-detail', {uuid: feed.uuid});
    }

    onSearchChange(value) {
        this.searchKey = value;
    }

    onSearchClear() {
        this.searchKey = '';
    }
}

export const FeedListComponent = {
    template, controller
};
