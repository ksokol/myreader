import template from './feed-list.component.html'
import {routeChange, routeSelector, fetchFeeds, feedsSelector} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            ...routeSelector(state),
            ...feedsSelector(state)
        }
    }

    mapDispatchToThis(dispatch) {
        return {
            open: feed => dispatch(routeChange(['admin', 'feed-detail'], {uuid: feed.uuid})),
            onSearch: params => dispatch(routeChange(['admin', 'feed'], params)),
            refresh: () => dispatch(fetchFeeds())
        }
    }
}

export const FeedListComponent = {
    template, controller
}
