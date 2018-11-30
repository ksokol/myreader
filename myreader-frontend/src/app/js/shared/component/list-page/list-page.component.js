import template from './list-page.component.html'
import './list-page.component.css'
import {routeSelector} from '../../../store'

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux

    this.onSearchChange = this.onSearchChange.bind(this)
  }

  $onInit() {
    this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis)(this)
  }

  $onDestroy() {
    this.unsubscribe()
  }

  mapStateToThis(state) {
    return {
      ...routeSelector(state)
    }
  }

  onSearchChange(q) {
    const params = {...this.router.query, q}
    this.myOnSearch({params})
  }

  get refreshProps() {
    return {
      type: 'redo',
      onClick: this.myOnRefresh
    }
  }

  get searchInputProps() {
    return {
      value: this.router.query.q,
      onChange: this.onSearchChange
    }
  }
}

/**
 * @deprecated
 */
export const ListPageComponent = {
  template, controller,
  transclude: {
    'action-panel': '?myActionPanel',
    'list-panel': 'myListPanel'
  },
  bindings: {
    myOnSearch: '&',
    myOnRefresh: '&'
  }
}
