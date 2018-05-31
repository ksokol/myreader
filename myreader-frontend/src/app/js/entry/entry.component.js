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

    toggleMore() {
        this.showMore = !this.showMore
    }

    toggleSeen() {
        this.updateItem({...this.item, seen: !this.item.seen})
    }

    onTagUpdate(tag) {
        this.updateItem({
            uuid: this.item.uuid,
            seen: this.item.seen,
            tag
        })
    }

    get props() {
        return {
            onToggleShowMore: this.toggleMore.bind(this),
            onToggleSeen: this.toggleSeen.bind(this),
            showMore: this.showMore,
            seen: this.item.seen
        }
    }
}

export const EntryComponent = {
    template, controller,
    bindings: {
        myItem: '<'
    }
}
