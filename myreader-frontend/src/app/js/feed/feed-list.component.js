import template from './feed-list.component.html'
import {showErrorNotification} from 'store'

class controller {

    constructor($state, $stateParams, $ngRedux, feedService) {
        'ngInject'
        this.$state = $state
        this.$stateParams = $stateParams
        this.$ngRedux = $ngRedux
        this.feedService = feedService
    }

    $onInit() {
        this.refresh()
    }

    open(feed) {
        this.$state.go('app.feed-detail', {uuid: feed.uuid})
    }

    onSearch(params) {
        this.$state.go('app.feed', params, {notify: false})
    }

    refresh() {
        this.feedService.findAll()
            .then(data => this.feeds = data)
            .catch(error => this.$ngRedux.dispatch(showErrorNotification(error)))
    }
}

export const FeedListComponent = {
    template, controller
}
