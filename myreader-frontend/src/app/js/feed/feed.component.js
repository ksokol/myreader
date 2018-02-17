import template from './feed.component.html'
import './feed.component.css'
import {feedSelector, showErrorNotification, showSuccessNotification, routeChange} from 'store'

class controller {

    constructor($ngRedux, feedService) {
        'ngInject'
        this.$ngRedux = $ngRedux
        this.feedService = feedService
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this)
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
            onSuccessDelete: () => dispatch(routeChange(['admin', 'feed']))
        }
    }

    onDelete() {
        return this.feedService.remove(this.feed)
    }

    onSave() {
        return this.feedService.save(this.feed)
    }

    onSuccessSave(text) {
        this.$ngRedux.dispatch(showSuccessNotification(text))
    }

    onError(error) {
        if(error.status === 409) {
            this.$ngRedux.dispatch(showErrorNotification('Can not delete. Feed has subscriptions'))
        } else if (error.status === 400) {
            this.validations = error.data.fieldErrors
        } else {
            this.$ngRedux.dispatch(showErrorNotification(error))
        }
    }
}

export const FeedComponent = {
    template, controller
}
