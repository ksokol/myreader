import {
  adminPermissionSelector,
  filteredByUnseenSubscriptionsSelector,
  routeChange,
  routeSelector
} from '../store'

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
      ...filteredByUnseenSubscriptionsSelector(state),
      ...routeSelector(state)
    }
  }

  mapDispatchToThis(dispatch) {
    return {
      routeTo: (route, query) => dispatch(routeChange(route, query))
    }
  }

  get props() {
    return {
      isAdmin: this.isAdmin,
      subscriptions: this.subscriptions,
      router: this.router,
      routeTo: this.routeTo
    }
  }
}

/**
 * @deprecated
 */
export const NavigationComponent = {
  template: '<react-component name="Navigation" props="$ctrl.props"></react-component>',
  controller
}
