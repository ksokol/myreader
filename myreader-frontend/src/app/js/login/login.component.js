import template from './login.component.html'
import './login.component.css'
import {authorizedSelector, adminPermissionSelector, tryLogin} from 'store'

class controller {

    constructor($state, $ngRedux) {
        'ngInject'
        this.$state = $state
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
            if(isAdmin) {
                this.$state.go('admin.overview')
            } else {
                this.$state.go('app.entries')
            }
        }
    }

    onClick() {
        this.actionPending = true
        return this.$ngRedux.dispatch(tryLogin(this.loginForm))
    }

    onError() {
        this.actionPending = false
        this.message = {type: 'error', message: 'Username or password wrong'}
    }
}

export const LoginComponent = {
    template, controller
}
