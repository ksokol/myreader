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
import React from 'react'
import {Input, withValidations} from '../shared/component/input'

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
            ...subscriptionTagsSelector(state),
            ...subscriptionExclusionPatternsSelector(state)
        }
    }

    onError(error) {
        this.$ngRedux.dispatch(showErrorNotification(error))
        this.pendingAction = false
    }

    onSelectTag(value) {
        this.subscription.tag = value
    }

    onSave() {
        this.validations = []
        this.pendingAction = true
        return this.$ngRedux.dispatch(saveSubscription(this.subscription))
    }

    onSuccessSave() {
        this.pendingAction = false
    }

    onErrorSave(error) {
        if(error.status === 400) {
            this.validations = error.data.fieldErrors
        }
        this.pendingAction = false
    }

    onDelete() {
        this.pendingAction = true
        return this.$ngRedux.dispatch(deleteSubscription(this.subscription.uuid))
    }

    onSuccessDelete() {
        this.$ngRedux.dispatch(routeChange(['app', 'subscriptions']))
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
}

export const SubscriptionComponent = {
    template, controller
}
