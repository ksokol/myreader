import React from 'react'
import {addSubscriptionExclusionPattern, removeSubscriptionExclusionPattern} from '../../store'

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux
  }

  handleError(error) {
    this.myOnError({error})
  }

  startProcessing() {
    this.processing = true
  }

  endProcessing() {
    this.processing = false
  }

  onRemove(uuid) {
    this.startProcessing()
    this.$ngRedux.dispatch(removeSubscriptionExclusionPattern(this.myId, uuid))
      .then(() => this.endProcessing())
      .catch(error => {
        this.handleError(error)
        this.endProcessing()
      })
  }

  onAdd(value) {
    this.startProcessing()
    this.$ngRedux.dispatch(addSubscriptionExclusionPattern(this.myId, value))
      .then(() => this.endProcessing())
      .catch(error => {
        this.endProcessing()
        this.handleError(error)
      })
  }

  placeholder() {
    return this.processing ? 'processing...' : 'Enter an exclusion pattern'
  }

  isDisabled() {
    return this.myId === undefined || this.myDisabled === true || this.processing
  }

  get props() {
    return {
      keyFn: props => props.uuid,
      values: this.myExclusions,
      placeholder: this.placeholder(),
      disabled: this.isDisabled(),
      renderItem: props => [<strong key="pattern">{props.pattern}</strong>, ' ',
        <em key="hitCount">({props.hitCount})</em>],
      onAdd: value => this.onAdd(value),
      onRemove: value => this.onRemove(value.uuid)
    }
  }
}

export const SubscriptionExclusionComponent = {
  controller,
  template: '<react-component name="Chips" props="$ctrl.props"></react-component>',
  bindings: {
    myId: '<',
    myExclusions: '<',
    myDisabled: '<',
    myOnError: '&'
  }
}
