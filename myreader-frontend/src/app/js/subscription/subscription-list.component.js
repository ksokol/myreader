import template from './subscription-list.component.html'
import {getSubscriptions, fetchSubscriptions} from 'store'

class controller {

    constructor($ngRedux, $state, $stateParams) {
        'ngInject'
        this.$ngRedux = $ngRedux
        this.$state = $state
        this.$stateParams = $stateParams
        this.unsubscribe = this.$ngRedux.connect(getSubscriptions)(this)
    }

    $onInit() {
        this.refresh()
    }

    $onDestroy() {
        this.unsubscribe()
    }

    navigateTo(subscription) {
        this.$state.go('app.subscription', {uuid: subscription.uuid})
    }

    refresh() {
        this.$ngRedux.dispatch(fetchSubscriptions())
    }

    onSearch(params) {
        this.$state.go('app.subscriptions', params, {notify: false})
    }
}

export const SubscriptionListComponent = {
    template, controller
}
