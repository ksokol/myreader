import template from './subscription-exclusion.component.html'
import {
    fetchSubscriptionExclusionPatterns, removeSubscriptionExclusionPattern,
    subscriptionExclusionPatternsSelector
} from 'store'

class controller {

    constructor($ngRedux, exclusionService) {
        'ngInject'
        this.$ngRedux = $ngRedux
        this.exclusionService = exclusionService
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

    sortExclusions() {
        this.exclusions.sort((left, right) => {
            if (left.pattern < right.pattern) {
                return -1
            }
            if (left.pattern > right.pattern) {
                return 1
            }
            return 0
        })
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

    addExclusion(exclusion) {
        this.exclusions.push(exclusion)
        this.sortExclusions()
    }

    onRemove(exclusion) {
        this.startProcessing()
        this.$ngRedux.dispatch(removeSubscriptionExclusionPattern(this.id, exclusion.uuid))
            .then(() => this.endProcessing())
            .catch(error => {
                this.handleError(error)
                this.endProcessing()
            })
    }

    onTransform($chip) {
        this.startProcessing()
        this.exclusionService.save(this.id, $chip)
            .then(exclusion => this.addExclusion(exclusion))
            .catch(error => this.handleError(error))
            .finally(() => this.endProcessing())

        return null // don't render the new chip
    }

    placeholder() {
        return this.processing ? 'processing...' : 'Enter an exclusion pattern'
    }

    isDisabled() {
        return this.id === undefined || this.myDisabled === true
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
