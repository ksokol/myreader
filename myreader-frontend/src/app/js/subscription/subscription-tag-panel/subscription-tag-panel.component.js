import template from './subscription-tag-panel.component.html'
import {fetchSubscriptionTags} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    loadTags() {
        return this.$ngRedux.dispatch(fetchSubscriptionTags())
    }
}

export const SubscriptionTagPanelComponent = {
    template, controller,
    bindings: {
        mySelectedItem: '<',
        myDisabled: '<',
        myOnSelect: '&',
        myOnClear: '&'
    }
}
