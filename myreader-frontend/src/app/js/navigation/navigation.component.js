import template from './navigation.component.html'
import './navigation.component.css'
import {adminPermissionSelector} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis)(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            isAdmin: adminPermissionSelector(state)
        }
    }
}

export const NavigationComponent = {
    template, controller
}
