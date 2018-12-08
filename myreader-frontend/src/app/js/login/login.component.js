import './login.component.css'
import {adminPermissionSelector, authorizedSelector, routeChange, tryLogin} from '../store'

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux

    this.onClick = this.onClick.bind(this)
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
      if (isAdmin) {
        this.$ngRedux.dispatch(routeChange(['admin', 'overview']))
      } else {
        this.$ngRedux.dispatch(routeChange(['app', 'entries']))
      }
    }
  }

  onClick(loginForm) {
    this.actionPending = true
    this.loginError = false
    this.$ngRedux.dispatch(tryLogin(loginForm))
      .catch(() => {
        this.actionPending = false
        this.loginError = true
      })
  }

  get props() {
    return {
      onLogin: this.onClick,
      disabled: this.actionPending,
      loginError: this.loginError
    }
  }
}

export const LoginComponent = {
  template: '<react-component name="LoginPage" props="$ctrl.props"></react-component>',
  controller
}
