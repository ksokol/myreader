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

    onSelect(tag, uuid) {
        const params = {feedTagEqual: null, feedUuidEqual: null}

        if(tag && tag !== 'all') {
            params['feedTagEqual'] = tag
        }
        if (uuid) {
            params['feedUuidEqual'] = uuid
        }

        this.$state.go('app.entries', params, {inherit: false})
        this.myOnSelect()
    }

    isInvisible(item) {
        return item.hasOwnProperty('unseen') && item.unseen <= 0
    }

    trackBy(subscription) {
        return JSON.stringify({uuid: subscription.uuid, unseen: subscription.unseen})
    }
}

export const NavigationSubscriptionItemComponent = {
    template, controller,
    bindings: {
        myItem: '<',
        /*
         * @deprecated
         */
        myOnSelect: '&'
    }
}
