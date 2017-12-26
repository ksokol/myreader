import template from './list-page.component.html'
import css from './list-page.component.css'

class controller {

    constructor($stateParams) {
        'ngInject'
        this.$stateParams = $stateParams
    }

    onSearchChange(q) {
        const params = {...this.$stateParams, q}
        this.myOnSearch({params})
    }

    onSearchClear() {
        const params = {...this.$stateParams, q: undefined}
        this.myOnSearch({params})
    }

    onRefresh() {
        this.myOnRefresh()
    }
}

export const ListPageComponent = {
    template, css, controller,
    transclude: {
        'list-panel': 'myListPanel'
    },
    bindings: {
        myOnSearch: '&',
        myOnRefresh: '&'
    }
}
