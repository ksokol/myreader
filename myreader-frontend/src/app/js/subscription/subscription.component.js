import template from './subscription.component.html'
import './subscription.component.css'
import {showErrorNotification, showSuccessNotification} from 'store'

class controller {

    constructor($state, $stateParams, $ngRedux, subscriptionService) {
        'ngInject'
        this.$state = $state
        this.$stateParams = $stateParams
        this.$ngRedux = $ngRedux
        this.subscriptionService = subscriptionService
    }

    $onInit() {
        if(this.$stateParams.uuid) {
            this.subscriptionService.find(this.$stateParams.uuid).then(data => this.subscription = data)
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
        return this.subscriptionService.save(this.subscription)
    }

    onSuccessSave(data) {
        this.$ngRedux.dispatch(showSuccessNotification('Subscription saved'))
        this.subscription = data
        this.pendingAction = false
    }

    onErrorSave(error) {
        if(error.data.status === 400) {
            this.validations = error.data.fieldErrors
        } else {
            this.onError(error)
        }
        this.pendingAction = false
    }

    onDelete() {
        this.pendingAction = true
        return this.subscriptionService.remove(this.subscription.uuid)
    }

    onSuccessDelete() {
        this.$state.go('app.subscriptions')
    }
}

export const SubscriptionComponent = {
    template, controller
}
