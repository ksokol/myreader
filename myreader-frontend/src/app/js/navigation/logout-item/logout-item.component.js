import template from './logout-item.component.html'
import css from './logout-item.component.css'
import {logout} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    logout() {
        this.$ngRedux.dispatch(logout())
    }
}

export const LogoutComponent = {
    template, css, controller
}
