import template from './navigation.component.html'
import './navigation.component.css'
import {
  adminPermissionSelector,
  filteredByUnseenSubscriptionsSelector,
  logout,
  routeChange,
  routeSelector
} from '../store'
import createSubscriptionNavigation from '../components/Navigation/SubscriptionNavigation/createSubscriptionNavigation'

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
      isAdmin: adminPermissionSelector(state),
      subscriptionNavigation: createSubscriptionNavigation(filteredByUnseenSubscriptionsSelector(state).subscriptions),
      ...routeSelector(state)
    }
  }

  mapDispatchToThis(dispatch) {
    return {
      routeTo: route => dispatch(routeChange(route)),
      logout: () => dispatch(logout()),
      onSelect: query => dispatch(routeChange(['app', 'entries'], {...query, q: null /* TODO Remove q query parameter from UI Router */}))
    }
  }

  props(item) {
    return {
      item,
      query: this.router.query,
      onSelect: this.onSelect
    }
  }
}

export const NavigationComponent = {
  template, controller
}
