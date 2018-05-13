import template from './subscription-exclusion.component.html'
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
}

export const SubscriptionExclusionComponent = {
    template, controller,
    bindings: {
        myId: '<',
        myExclusions: '<',
        myDisabled: '<',
        myOnError: '&'
    }
}
