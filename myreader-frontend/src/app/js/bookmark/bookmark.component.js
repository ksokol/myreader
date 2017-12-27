import template from './bookmark.component.html'
import css from './bookmark.component.css'
import {fetchEntries, fetchEntryTags, getEntryTags, entryClear} from 'store'
import {SUBSCRIPTION_ENTRIES} from '../constants'

class controller {

    constructor($ngRedux, $state, $stateParams) {
        'ngInject'
        this.$ngRedux = $ngRedux
        this.$state = $state
        this.$stateParams = $stateParams
        this.unsubscribe = this.$ngRedux.connect(getEntryTags)(this)
    }

    $onInit() {
        this.refresh()
    }

    $onDestroy() {
        this.$ngRedux.dispatch(entryClear())
        this.unsubscribe()
    }

    refresh() {
        this.$ngRedux.dispatch(entryClear())
        this.$ngRedux.dispatch(fetchEntryTags())
        this.retrieveEntries({...this.$stateParams})
    }

    onTagSelect(entryTagEqual) {
        this.retrieveEntries({...this.$stateParams, entryTagEqual})
    }

    retrieveEntries(params) {
        const query = {...params, seenEqual: '*'}
        this.$state.go('app.bookmarks', query , {notify: false})
            .then(() => this.$ngRedux.dispatch(fetchEntries({path: SUBSCRIPTION_ENTRIES, query})))
    }
}

export const BookmarkComponent = {
    template, css, controller
}
