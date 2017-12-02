import template from './feed-list.component.html';
import './feed-list.component.css';

class controller {

    constructor($state, feedService) {
        'ngInject';
        this.$state = $state;
        this.feedService = feedService;
    }

    $onInit() {
        this.feedService.findAll()
            .then(data => this.feeds = data)
            .catch (error => this.message = {type: 'error', message: error});
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
