import template from './subscriptions-item.component.html'
import './subscriptions-item.component.css'
import {navigationBuilder} from './navigation-builder'

class controller {

  $onChanges(changes) {
    if (changes.mySubscriptions && changes.mySubscriptions.currentValue) {
      const {subscriptionsGroupedByTag, subscriptionsWithoutTag} = navigationBuilder(changes.mySubscriptions.currentValue)
      this.subscriptionsGroupedByTag = subscriptionsGroupedByTag
      this.subscriptionsWithoutTag = subscriptionsWithoutTag
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
      query: this.myQuery,
      onSelect: query => this.myOnSelect({query})
    }
  }
}

export const NavigationSubscriptionsItemComponent = {
  template, controller,
  bindings: {
    mySubscriptions: '<',
    myQuery: '<',
    myOnSelect: '&'
  }
}
