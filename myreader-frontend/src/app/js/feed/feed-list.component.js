import template from './feed-list.component.html'
import './feed-list.component.css'
import {feedsSelector, fetchFeeds, routeChange, routeSelector} from '../store'

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
      ...feedsSelector(state)
    }
  }

  mapDispatchToThis(dispatch) {
    return {
      open: feed => dispatch(routeChange(['admin', 'feed-detail'], {uuid: feed.uuid})),
      onSearch: params => dispatch(routeChange(['admin', 'feed'], params)),
      refresh: () => dispatch(fetchFeeds())
    }
  }

  get iconProps() {
    return {
      type: 'exclamation-triangle'
    }
  }
}

export const FeedListComponent = {
  template, controller
}
