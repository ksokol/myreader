import template from './subscription-item.component.html'
import './subscription-item.component.css'

class controller {

  $onInit() {
    this.item = this.myItem || {}
  }

  onSelect(feedTagEqual, feedUuidEqual) {
    this.myOnSelect({
      query: {
        feedTagEqual,
        feedUuidEqual,
        q: null // TODO Remove q query parameter from UI Router
      }
    })
  }

  isSelected(item) {
    return this.myQuery.feedUuidEqual === item.uuid && this.myQuery.feedTagEqual === item.tag
  }

  isOpen() {
    return this.myQuery.feedTagEqual === this.item.tag
  }

  isVisible() {
    return this.isOpen() && (this.item.subscriptions ? this.item.subscriptions.length > 0 : false)
  }

  trackBy(item) {
    return JSON.stringify({uuid: item.uuid, unseen: item.unseen})
  }
}

export const NavigationSubscriptionItemComponent = {
  template, controller,
  bindings: {
    myItem: '<',
    myQuery: '<',
    myOnSelect: '&'
  }
}
