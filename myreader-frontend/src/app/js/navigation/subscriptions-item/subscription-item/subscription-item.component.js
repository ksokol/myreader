import template from './subscription-item.component.html'
import './subscription-item.component.css'

class controller {

    constructor($state, $stateParams) {
        'ngInject'
        this.$state = $state
        this.$stateParams = $stateParams
    }

    $onInit() {
        this.item = this.myItem || {}
    }

    isSelected(item) {
        return this.$stateParams['feedUuidEqual'] === item.uuid && this.$stateParams['feedTagEqual'] === item.tag
    }

    isOpen() {
        return this.$stateParams['feedTagEqual'] === this.item.tag
    }

    onSelect(feedTagEqual, feedUuidEqual) {
        this.$state.go('app.entries', {feedTagEqual, feedUuidEqual}, {inherit: false})
    }

    isVisible() {
        return this.isOpen() && (this.item.subscriptions ? this.item.subscriptions.length > 0 : false)
    }

    trackBy(item) {
        return JSON.stringify({uuid: item.uuid, unseen: item.unseen})
    }
}

export const NavigationSubscriptionItemComponent = {
    template, controller,
    bindings: {
        myItem: '<'
    }
}
