import template from './maintenance-actions.component.html'
import {rebuildSearchIndex} from '../../store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    onRefreshIndex() {
        this.$ngRedux.dispatch(rebuildSearchIndex())
    }
}

export const MaintenanceActionsComponent = {
    template, controller
}
