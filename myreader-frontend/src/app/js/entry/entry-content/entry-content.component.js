import template from './entry-content.component.html'
import './entry-content.component.css'
import {settingsShowEntryDetailsSelector, mediaBreakpointIsDesktopSelector} from '../../store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis)(this)
        this.item = this.myItem || {}
        this.show = this.myShow || false
    }

    $onDestroy() {
        this.unsubscribe()
    }

    $onChanges(obj) {
        if (obj.myShow) {
            this.show = obj.myShow.currentValue
        }
    }

    mapStateToThis(state) {
        return {
            showEntryDetails: settingsShowEntryDetailsSelector(state),
            isDesktop: mediaBreakpointIsDesktopSelector(state)
        }
    }

    showEntryContent () {
        return this.isDesktop ? this.showEntryDetails || this.show : this.show
    }
}

export const EntryContentComponent = {
    template, controller,
    bindings: {
        myItem: '<',
        myShow: '<'
    }
}
