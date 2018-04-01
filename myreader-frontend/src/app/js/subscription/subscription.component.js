import template from './subscription.component.html'
import './subscription.component.css'
import {
    deleteSubscription,
    routeChange,
    saveSubscription,
    showErrorNotification,
    subscriptionTagsSelector,
    subscriptionEditFormSelector
} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            ...subscriptionEditFormSelector(state),
            ...subscriptionTagsSelector(state)
        }
    }

    onError(error) {
        this.$ngRedux.dispatch(showErrorNotification(error))
        this.pendingAction = false
    }

    onSelectTag(value) {
        this.subscription.tag = value
    }

    onClearTag() {
        this.subscription.tag = null
    }

    onSave() {
        this.pendingAction = true
        return this.$ngRedux.dispatch(saveSubscription(this.subscription))
    }

    onSuccessSave() {
        this.pendingAction = false
    }

    onErrorSave(error) {
        if(error.status === 400) {
            this.validations = error.data.fieldErrors
        }
        this.pendingAction = false
    }

    onDelete() {
        this.pendingAction = true
        return this.$ngRedux.dispatch(deleteSubscription(this.subscription.uuid))
    }

    onSuccessDelete() {
        this.$ngRedux.dispatch(routeChange(['app', 'subscriptions']))
    }
}

export const SubscriptionComponent = {
    template, controller
}
