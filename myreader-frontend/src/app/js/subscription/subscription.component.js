import template from './subscription.component.html'
import './subscription.component.css'
import {
  deleteSubscription,
  routeChange,
  saveSubscription,
  showErrorNotification,
  subscriptionEditFormSelector,
  subscriptionExclusionPatternsSelector,
  subscriptionTagsSelector
} from '../store'
import {Input, withValidations} from '../components'

/**
 * @deprecated
 */
export const SubscriptionTitleInput = withValidations(Input)

/**
 * @deprecated
 */
export const SubscriptionUrlInput = Input

class controller {

  constructor($ngRedux) {
    'ngInject'
    this.$ngRedux = $ngRedux

    this.onSave = this.onSave.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  $onInit() {
    this.validations = []
    this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis)(this)
  }

  $onDestroy() {
    this.unsubscribe()
  }

  mapStateToThis(state) {
    return {
      ...subscriptionEditFormSelector(state),
      tags: [...subscriptionTagsSelector(state).subscriptionTags.map(it => it.name)],
      ...subscriptionExclusionPatternsSelector(state)
    }
  }

  onError(error) {
    this.$ngRedux.dispatch(showErrorNotification(error))
    this.pendingAction = false
  }

  onSelectTag(value) {
    this.subscription.feedTag.name = value
  }

  onSave() {
    this.validations = []
    this.pendingAction = true
    this.$ngRedux.dispatch(saveSubscription(this.subscription))
      .then(() => this.pendingAction = false)
      .catch(error => {
        if (error.status === 400) {
          this.validations = error.data.fieldErrors
        }
        this.pendingAction = false
      })
  }

  onDelete() {
    this.pendingAction = true
    this.$ngRedux.dispatch(deleteSubscription(this.subscription.uuid))
      .then(() => this.$ngRedux.dispatch(routeChange(['app', 'subscriptions'])))
      .catch(() => this.pendingAction = false)
  }

  get titleProps() {
    return {
      name: 'title',
      value: this.subscription.title,
      label: 'Title',
      disabled: this.pendingAction,
      validations: this.validations,
      onChange: value => this.subscription.title = value
    }
  }

  get urlProps() {
    return {
      name: 'origin',
      value: this.subscription.origin,
      label: 'Url',
      disabled: true
    }
  }

  get iconProps() {
    return {
      type: 'link'
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

  get deleteButtonProps() {
    return {
      children: 'Delete',
      caution: true,
      disabled: this.pendingAction,
      onClick: this.onDelete
    }
  }
}

export const SubscriptionComponent = {
  template, controller
}
