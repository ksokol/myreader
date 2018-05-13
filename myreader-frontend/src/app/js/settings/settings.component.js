import template from './settings.component.html'
import './settings.component.css'
import {getSettings, updateSettings} from '../store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
        this.unsubscribe = $ngRedux.connect(getSettings)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    save() {
        this.$ngRedux.dispatch(updateSettings({
            pageSize: this.pageSize,
            showUnseenEntries: this.showUnseenEntries,
            showEntryDetails: this.showEntryDetails
        }))
    }

    onPageSizeChoose(option) {
        this.pageSize = option
        this.save()
    }

    onShowUnseenEntriesChoose(option) {
        this.showUnseenEntries = option
        this.save()
    }

    onShowEntryDetailsChoose(option) {
        this.showEntryDetails = option
        this.save()
    }
}

export const SettingsComponent = {
    template, controller
}
