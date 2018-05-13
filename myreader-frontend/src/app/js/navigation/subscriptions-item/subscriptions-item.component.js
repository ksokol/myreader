import template from './subscriptions-item.component.html'
import './subscriptions-item.component.css'
import {filteredByUnseenSubscriptionsSelector} from '../../store'
import {navigationBuilder} from './navigation-builder'

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
        return navigationBuilder(filteredByUnseenSubscriptionsSelector(state).subscriptions)
    }

    trackBy(item) {
        return JSON.stringify({
            title: item.title,
            unseen: item.unseen,
            subscriptions: item.subscriptions ? item.subscriptions.length : null
        })
    }
}

export const NavigationSubscriptionsItemComponent = {
    template, controller
}
