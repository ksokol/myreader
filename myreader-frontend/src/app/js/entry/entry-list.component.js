import template from './entry-list.component.html'
import css from './entry-list.component.css'
import {fetchEntries, getEntries} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
        this.unsubscribe = this.$ngRedux.connect(getEntries)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    isFocused(item) {
        return this.entryInFocus.uuid === item.uuid
    }

    loadMore(more) {
        this.$ngRedux.dispatch(fetchEntries(more))
    }
}

export const EntryListComponent = {
    template, css, controller
}
