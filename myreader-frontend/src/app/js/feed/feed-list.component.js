import template from './feed-list.component.html'
import {routeChange, routeSelector, showErrorNotification} from 'store'

class controller {

    constructor($ngRedux, feedService) {
        'ngInject'
        this.$ngRedux = $ngRedux
        this.feedService = feedService
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this)
        this.refresh()
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            ...routeSelector(state)
        }
    }

    mapDispatchToThis(dispatch) {
        return {
            open: feed => dispatch(routeChange(['admin', 'feed-detail'], {uuid: feed.uuid})),
            onSearch: params => dispatch(routeChange(['admin', 'feed'], params))
        }
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
