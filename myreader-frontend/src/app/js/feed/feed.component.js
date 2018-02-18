import template from './feed.component.html'
import './feed.component.css'
import {changeFeed, deleteFeed, feedSelector, routeChange, showErrorNotification, showSuccessNotification} from 'store'

class controller {

    constructor($ngRedux, feedService) {
        'ngInject'
        this.$ngRedux = $ngRedux
        this.feedService = feedService
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis.bind(this))(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            feed: feedSelector(state)
        }
    }

    mapDispatchToThis(dispatch) {
        return {
            onSuccessDelete: () => dispatch(routeChange(['admin', 'feed'])),
            onSave: () => dispatch(changeFeed(this.feed)),
            onDelete: () => dispatch(deleteFeed(this.feed.uuid))
        }
    }

    onSuccessSave(text) {
        this.$ngRedux.dispatch(showSuccessNotification(text))
    }

    onError(error) {
        if(error.status === 409) {
            this.$ngRedux.dispatch(showErrorNotification('Can not delete. Feed has subscriptions'))
        } else if (error.status === 400) {
            this.validations = error.data.fieldErrors
        }
    }
}

export const FeedComponent = {
    template, controller
}
