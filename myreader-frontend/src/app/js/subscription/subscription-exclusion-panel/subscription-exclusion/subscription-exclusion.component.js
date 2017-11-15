import template from './subscription-exclusion.component.html';

class controller {

    constructor(exclusionService) {
        'ngInject';
        this.exclusionService = exclusionService;
    }

    handleError(error) {
        this.myOnError({error: error});
    }

    sortExclusions() {
        this.exclusions.sort((left, right) => {
            if (left.pattern < right.pattern) {
                return -1;
            }
            if (left.pattern > right.pattern) {
                return 1;
            }
            return 0;
        })
    }

    startLoading() {
        this.loading = true;
    }

    endLoading() {
        this.loading = false;
    }

    startProcessing() {
        this.processing = true;
    }

    endProcessing() {
        this.processing = false;
    }

    initExclusions(exclusions) {
        this.exclusions = exclusions;
        this.sortExclusions();
    }

    addExclusion(exclusion) {
        this.exclusions.push(exclusion);
        this.sortExclusions();
    }

    $onChanges(obj) {
        if(obj.myId.currentValue && obj.myId.currentValue !== this.id) {
            this.id = obj.myId.currentValue;
            this.startLoading();

            this.exclusionService.find(this.id)
                .then((exclusions) => this.initExclusions(exclusions))
                .catch((error) => this.handleError(error))
                .finally(() => this.endLoading());
        }
    }

    onRemove(exclusion) {
        this.startProcessing();
        this.exclusionService.delete(this.id, exclusion.uuid)
            .catch(error => {
                this.addExclusion(exclusion);
                this.handleError(error);
            })
            .finally(() => this.endProcessing());
    }

    onTransform($chip) {
        this.startProcessing();
        this.exclusionService.save(this.id, $chip)
            .then((exclusion) => this.addExclusion(exclusion))
            .catch((error) => this.handleError(error))
            .finally(() => this.endProcessing());

        return null; // don't render the new chip
    }

    placeholder() {
        return this.processing ? 'processing...' : 'Enter an exclusion pattern';
    }

    isDisabled() {
        return this.id === undefined || this.myDisabled === true;
    }
}

export const SubscriptionExclusionComponent = {
    template, controller,
    bindings: {
        myId: '<',
        myDisabled: '<',
        myOnError: '&'
    }
};
