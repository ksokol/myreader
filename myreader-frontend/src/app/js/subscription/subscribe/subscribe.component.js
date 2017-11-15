import template from './subscribe.component.html';

class controller {

    constructor($state, subscriptionService) {
        'ngInject';
        this.$state = $state;
        this.subscriptionService = subscriptionService;
    }

    onSave() {
        return this.subscriptionService.save({origin: this.origin});
    }

    onSuccessSave(data) {
        this.$state.go('app.subscription', {uuid: data.uuid});
    }

    onError(error) {
        this.message = { type: 'error', message: error };
    }

    onErrorSave(error) {
        if(error.data.status === 400) {
            this.validations = error.data.fieldErrors
        } else {
            this.onError(error);
        }
    }
}

export const SubscribeComponent = {
    template, controller
};
