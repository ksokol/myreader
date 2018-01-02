import template from './subscription.component.html'
import './subscription.component.css'
import {deleteSubscription, saveSubscription, showErrorNotification, getSubscriptions} from 'store'

class controller {

    constructor($state, $stateParams, $ngRedux) {
        'ngInject'
        this.$state = $state
        this.$stateParams = $stateParams
        this.$ngRedux = $ngRedux
        this.unsubscribe = this.$ngRedux.connect(getSubscriptions)(this)
    }

    set subscriptions(subscriptions) {
        this.subscription = subscriptions.find(it => it.uuid === this.$stateParams.uuid)
    }

    $onDestroy() {
        this.unsubscribe()
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
        this.$state.go('app.subscriptions')
    }
}

export const SubscriptionComponent = {
    template, controller
}
