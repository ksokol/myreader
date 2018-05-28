import template from './entry.component.html'
import './entry.component.css'
import {changeEntry, mediaBreakpointIsDesktopSelector, settingsShowEntryDetailsSelector} from '../store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis)(this)
    }

    $onChanges(changes) {
        this.item = changes.myItem.currentValue
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            showEntryDetails: settingsShowEntryDetailsSelector(state),
            isDesktop: mediaBreakpointIsDesktopSelector(state)
        }
    }

    showEntryContent() {
        return this.isDesktop ? this.showEntryDetails || this.showMore : this.showMore
    }

    updateItem(item) {
        this.$ngRedux.dispatch(changeEntry(item))
    }

    toggleMore(showMore) {
        this.showMore = showMore
    }

    onCheck(item) {
        this.updateItem({
            uuid: this.item.uuid,
            seen: item.seen,
            tag: this.item.tag
        })
    }

    onTagUpdate(tag) {
        this.updateItem({
            uuid: this.item.uuid,
            seen: this.item.seen,
            tag
        })
    }
}

export const EntryComponent = {
    template, controller,
    bindings: {
        myItem: '<'
    }
}
