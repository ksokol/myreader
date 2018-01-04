import template from './feed-stream.component.html'
import {
    changeEntry,
    entryClear,
    entryFocusNext,
    entryFocusPrevious,
    fetchEntries,
    fetchSubscriptions,
    getEntryInFocus,
    getNextFocusableEntry
} from 'store'
import {SUBSCRIPTION_ENTRIES} from '../constants'

class controller {

    constructor($ngRedux, $state, $stateParams) {
        'ngInject'
        this.$ngRedux = $ngRedux
        this.$state = $state
        this.$stateParams = $stateParams
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis)(this)
        this.navigateTo(this.$stateParams)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            entryInFocus: getEntryInFocus(state),
            nextFocusableEntry: getNextFocusableEntry(state)
        }
    }

    nextEntry() {
        if (this.nextFocusableEntry.seen === false) {
            this.$ngRedux.dispatch(changeEntry({...this.nextFocusableEntry, seen: true}))
        }
        this.$ngRedux.dispatch(entryFocusNext())
    }

    previousEntry() {
        this.$ngRedux.dispatch(entryFocusPrevious())
    }

    navigateTo(params) {
        this.$state.go('app.entries', params, {notify: false})
            .then(() => this.$ngRedux.dispatch(fetchEntries({path: SUBSCRIPTION_ENTRIES, query: params})))
    }

    toggleEntryReadFlag() {
        this.$ngRedux.dispatch(changeEntry({...this.entryInFocus, seen: !this.entryInFocus.seen}))
    }

    refresh() {
        this.$ngRedux.dispatch(entryClear())
        this.$ngRedux.dispatch(fetchSubscriptions())
        this.navigateTo(this.$stateParams)
    }
}

export const FeedStreamComponent = {
    template, controller
}
