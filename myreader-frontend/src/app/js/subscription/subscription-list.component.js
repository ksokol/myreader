import template from './subscription-list.component.html'
import {fetchSubscriptions, routeChange} from '../store'
import {SubscriptionListContainer} from '../containers'

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux
  }

  $onInit() {
    this.unsubscribe = this.$ngRedux.connect(() => ({}), this.mapDispatchToThis)(this)
  }

  $onDestroy() {
    this.unsubscribe()
  }

  mapDispatchToThis(dispatch) {
    return {
      refresh: () => dispatch(fetchSubscriptions()),
      onSearch: params => dispatch(routeChange(['app', 'subscriptions'], {...params}))
    }
  }

  get bridgeProps() {
    return {
      component: () => SubscriptionListContainer,
    }
  }
}

export const SubscriptionListComponent = {
  template, controller
}
