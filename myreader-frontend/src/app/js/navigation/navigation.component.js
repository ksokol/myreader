import template from './navigation.component.html'
import './navigation.component.css'
import {
  adminPermissionSelector,
  filteredByUnseenSubscriptionsSelector,
  logout,
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
      routeTo: route => dispatch(routeChange(route)),
      logout: () => dispatch(logout()),
      onSelect: query => dispatch(routeChange(['app', 'entries'], {...query, q: null /* TODO Remove q query parameter from UI Router */}))
    }
  }
}

export const NavigationComponent = {
  template, controller
}
