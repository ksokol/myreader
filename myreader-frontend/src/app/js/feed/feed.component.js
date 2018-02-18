import template from './feed.component.html'
import './feed.component.css'
import {changeFeed, deleteFeed, feedSelector, routeChange} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
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

    onError(error) {
        if (error.status === 400) {
            this.validations = error.data.fieldErrors
        }
    }
}

export const FeedComponent = {
    template, controller
}
