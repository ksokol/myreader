import template from './subscribe.component.html';
import {showErrorNotification} from '../../store/common/index';

class controller {

    constructor($state, $ngRedux, subscriptionService) {
        'ngInject';
        this.$state = $state;
        this.$ngRedux = $ngRedux;
        this.subscriptionService = subscriptionService;
    }

    onSave() {
        return this.subscriptionService.save({origin: this.origin});
    }

    onSuccessSave(data) {
        this.$state.go('app.subscription', {uuid: data.uuid});
    }

    onError(error) {
        this.$ngRedux.dispatch(showErrorNotification(error));
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
