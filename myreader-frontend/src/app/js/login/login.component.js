import template from './login.component.html'
import './login.component.css'
import {authorizedSelector, adminPermissionSelector, tryLogin, routeChange} from '../store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.subscribe(() => this.handleStateChange(this.$ngRedux.getState()))
        this.handleStateChange(this.$ngRedux.getState())
    }

    $onDestroy() {
        this.unsubscribe()
    }

    handleStateChange(state) {
        const authorized = authorizedSelector(state)
        const isAdmin = adminPermissionSelector(state)

        if (authorized) {
            this.unsubscribe()
            if(isAdmin) {
                this.$ngRedux.dispatch(routeChange(['admin', 'overview']))
            } else {
                this.$ngRedux.dispatch(routeChange(['app', 'entries']))
            }
        }
    }

    onClick() {
        this.actionPending = true
        this.loginError = false
        return this.$ngRedux.dispatch(tryLogin(this.loginForm))
    }

    onError() {
        this.actionPending = false
        this.loginError = true
    }
}

export const LoginComponent = {
    template, controller
}
