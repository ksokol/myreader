import './login.component.css'
import {tryLogin} from '../store'

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux

    this.onClick = this.onClick.bind(this)
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
