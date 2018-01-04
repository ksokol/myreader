import template from './entry-list.component.html'
import './entry-list.component.css'
import {entryClear, fetchEntries, getEntries} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
        this.unsubscribe = this.$ngRedux.connect(getEntries)(this)
    }

    $onDestroy() {
        this.unsubscribe()
        this.$ngRedux.dispatch(entryClear())
    }

    isFocused(item) {
        return this.entryInFocus.uuid === item.uuid
    }

    loadMore(more) {
        this.$ngRedux.dispatch(fetchEntries(more))
    }
}

export const EntryListComponent = {
    template, controller
}
