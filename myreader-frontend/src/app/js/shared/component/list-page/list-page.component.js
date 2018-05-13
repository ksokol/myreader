import template from './list-page.component.html'
import './list-page.component.css'
import {routeSelector} from '../../../store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
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

    onRefresh() {
        this.myOnRefresh()
    }
}

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
