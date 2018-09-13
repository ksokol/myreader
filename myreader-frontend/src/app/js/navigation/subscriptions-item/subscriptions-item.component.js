import template from './subscriptions-item.component.html'
import './subscriptions-item.component.css'
import {filteredByUnseenSubscriptionsSelector, routeChange, routeSelector} from '../../store'
import {navigationBuilder} from './navigation-builder'

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
      ...navigationBuilder(filteredByUnseenSubscriptionsSelector(state).subscriptions),
      ...routeSelector(state)
    }
  }

  mapDispatchToThis(dispatch) {
    return {
      onSelect: query => dispatch(routeChange(['app', 'entries'], query))
    }
  }

  trackBy(item) {
    return JSON.stringify({
      title: item.title,
      unseen: item.unseen,
      subscriptions: item.subscriptions ? item.subscriptions.length : null
    })
  }

  props(item) {
    return {
      item,
      query: this.router.query,
      onSelect: this.onSelect
    }
  }
}

export const NavigationSubscriptionsItemComponent = {
  template, controller
}
