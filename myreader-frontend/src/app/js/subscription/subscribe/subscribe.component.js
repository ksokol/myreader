import template from './subscribe.component.html'
import './subscribe.component.css'
import {routeChange, saveSubscription} from '../../store'
import React from 'react'
import {Input, withValidations} from '../../shared/component/input'

/**
 * @deprecated
 */
export const SubscribeOriginInput = withValidations(Input)

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux
    this.origin = ''
  }

  onSave() {
    this.validations = undefined
    return this.$ngRedux.dispatch(saveSubscription({origin: this.origin}))
  }

  onSuccessSave(data) {
    this.$ngRedux.dispatch(routeChange(['app', 'subscription'], {uuid: data.uuid}))
  }

  onErrorSave(error) {
    if (error.status === 400) {
      this.validations = error.data.fieldErrors
    }
  }

  get props() {
    return {
      label: 'Url',
      name: 'origin',
      value: this.origin,
      validations: this.validations,
      onChange: value => this.origin = value
    }
  }
}

export const SubscribeComponent = {
  template, controller
}
