import template from './list-page.component.html'
import './list-page.component.css'

class controller {

    constructor($stateParams) {
        'ngInject'
        this.$stateParams = $stateParams
    }

    onSearchChange(q) {
        const params = {...this.$stateParams, q}
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
