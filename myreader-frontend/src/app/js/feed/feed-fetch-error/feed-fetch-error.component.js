import template from './feed-fetch-error.component.html'
import './feed-fetch-error.component.css'
import {feedFetchFailuresSelector, fetchFeedFetchFailures} from 'store'

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
            ...feedFetchFailuresSelector(state)
        }
    }

    mapDispatchToThis(dispatch) {
        return {
            onMore: link => dispatch(fetchFeedFetchFailures(link))
        }
    }
}

export const FeedFetchErrorComponent = {
    template, controller
}
