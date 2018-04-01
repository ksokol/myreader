import template from './subscription-list.component.html'
import './subscription-list.component.css'
import {fetchSubscriptions, getSubscriptions, routeChange, routeSelector} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            ...routeSelector(state),
            ...getSubscriptions(state)
        }
    }

    mapDispatchToThis(dispatch) {
        return {
            navigateTo: subscription => dispatch(routeChange(['app', 'subscription'], {uuid: subscription.uuid})),
            refresh: () => dispatch(fetchSubscriptions()),
            onSearch: params => dispatch(routeChange(['app', 'subscriptions'], {...params}))
        }
    }
}

export const SubscriptionListComponent = {
    template, controller
}
