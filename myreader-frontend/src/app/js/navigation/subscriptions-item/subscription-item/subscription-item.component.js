import template from './subscription-item.component.html'
import './subscription-item.component.css'
import {routeChange, routeSelector} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.item = this.myItem || {}
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            ...routeSelector(state)
        }
    }

    mapDispatchToThis(dispatch) {
        return {
            onSelect: (feedTagEqual, feedUuidEqual) => dispatch(routeChange(['app', 'entries'], {feedTagEqual, feedUuidEqual}))
        }
    }

    isSelected(item) {
        return this.router.query.feedUuidEqual === item.uuid && this.router.query.feedTagEqual === item.tag
    }

    isOpen() {
        return this.router.query.feedTagEqual === this.item.tag
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
        myItem: '<'
    }
}
