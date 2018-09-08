import template from './login.component.html'
import './login.component.css'
import {adminPermissionSelector, authorizedSelector, routeChange, tryLogin} from '../store'
import React from 'react'
import {Input} from '../components'

/**
 * @deprecated
 */
export const LoginEmailInput = Input

/**
 * @deprecated
 */
export const LoginPasswordInput = Input

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux
    this.loginForm = {
      username: '',
      password: ''
    }
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

  onClick() {
    this.actionPending = true
    this.loginError = false
    return this.$ngRedux.dispatch(tryLogin(this.loginForm))
  }

  onError() {
    this.actionPending = false
    this.loginError = true
  }

  get emailProps() {
    return {
      type: 'email',
      name: 'username',
      label: 'Email',
      value: this.loginForm.username,
      autoComplete: 'email',
      onChange: value => this.loginForm.username = value,
      disabled: this.actionPending
    }
  }

  get passwordProps() {
    return {
      type: 'password',
      name: 'password',
      label: 'Password',
      value: this.loginForm.password,
      autoComplete: 'current-password',
      onChange: value => this.loginForm.password = value,
      disabled: this.actionPending
    }
  }
}

export const LoginComponent = {
  template, controller
}
