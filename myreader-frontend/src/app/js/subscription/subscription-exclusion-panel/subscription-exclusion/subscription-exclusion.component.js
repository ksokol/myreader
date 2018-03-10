import template from './subscription-exclusion.component.html'
import {
    addSubscriptionExclusionPattern, fetchSubscriptionExclusionPatterns, removeSubscriptionExclusionPattern,
    subscriptionExclusionPatternsSelector
} from 'store'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.id = this.myId
        this.startLoading()

        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis.bind(this))(this)

        this.$ngRedux.dispatch(fetchSubscriptionExclusionPatterns(this.myId))
            .then(() => this.endLoading())
            .catch(error => {
                this.handleError(error)
                this.endLoading()
            })
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            exclusions: subscriptionExclusionPatternsSelector(this.myId)(state)
        }
    }

    handleError(error) {
        this.myOnError({error})
    }

    startLoading() {
        this.loading = true
    }

    endLoading() {
        this.loading = false
    }

    startProcessing() {
        this.processing = true
    }

    endProcessing() {
        this.processing = false
    }

    onRemove(uuid) {
        this.startProcessing()
        this.$ngRedux.dispatch(removeSubscriptionExclusionPattern(this.id, uuid))
            .then(() => this.endProcessing())
            .catch(error => {
                this.handleError(error)
                this.endProcessing()
            })
    }

    onAdd(value) {
        this.startProcessing()
        this.$ngRedux.dispatch(addSubscriptionExclusionPattern(this.id, value))
            .then(() => this.endProcessing())
            .catch(error => {
                this.endProcessing()
                this.handleError(error)
            })
        return null // don't render the new chip
    }

    placeholder() {
        return this.processing ? 'processing...' : 'Enter an exclusion pattern'
    }

    isDisabled() {
        return this.id === undefined || this.myDisabled === true || this.processing
    }
}

export const SubscriptionExclusionComponent = {
    template, controller,
    bindings: {
        myId: '<',
        myDisabled: '<',
        myOnError: '&'
    }
}
