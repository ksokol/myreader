import './subscriptions-item.component.css'
import createSubscriptionNavigation from '../../components/Navigation/SubscriptionNavigation/createSubscriptionNavigation'

class controller {

  $onChanges(changes) {
    if (changes.mySubscriptions && changes.mySubscriptions.currentValue) {
      this.groups = createSubscriptionNavigation(changes.mySubscriptions.currentValue)
    }
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
  controller,
  template: `
    <react-component
      name="SubscriptionNavigationItem"
      props="$ctrl.props(item)"
      ng-repeat="item in $ctrl.groups track by item.key">
    </react-component>`,
  bindings: {
    mySubscriptions: '<',
    myQuery: '<',
    myOnSelect: '&'
  }
}
