import template from './subscribe.component.html'
import './subscribe.component.css'
import {routeChange, saveSubscription} from '../../store'
import {Input, withValidations} from '../../components'

/**
 * @deprecated
 */
export const SubscribeOriginInput = withValidations(Input)

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux
    this.origin = ''
    this.validations = []

    this.onSave = this.onSave.bind(this)
  }

  onSave() {
    this.validations = undefined
    this.pendingAction = true
    this.$ngRedux.dispatch(saveSubscription({origin: this.origin}))
      .then(({uuid}) => this.$ngRedux.dispatch(routeChange(['app', 'subscription'], {uuid})))
      .catch(error => {
        if (error.status === 400) {
          this.validations = error.data.fieldErrors
        }
        this.pendingAction = false
      })
  }

  get props() {
    return {
      type: 'url',
      label: 'Url',
      name: 'origin',
      value: this.origin,
      validations: this.validations,
      onChange: value => this.origin = value
    }
  }

  get saveButtonProps() {
    return {
      children: 'Save',
      primary: true,
      disabled: this.pendingAction,
      onClick: this.onSave
    }
  }
}

export const SubscribeComponent = {
  template, controller
}
