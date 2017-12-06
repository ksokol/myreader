import template from './feed.component.html';
import './feed.component.css';
import {showErrorNotification, showSuccessNotification} from '../store/common/index';

class controller {

    constructor($state, $stateParams, $ngRedux, feedService) {
        'ngInject';
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$ngRedux = $ngRedux;
        this.feedService = feedService;
    }

    $onInit() {
        this.feedService.findOne(this.$stateParams.uuid)
            .then(data => this.feed = data)
            .catch(error => this.$ngRedux.dispatch(showErrorNotification(error)));
    }

    onDelete() {
        return this.feedService.remove(this.feed);
    }

    onSuccessDelete() {
        this.$state.go('admin.feed');
    }

    onSave() {
        return this.feedService.save(this.feed);
    }

    onSuccessSave(text) {
        this.$ngRedux.dispatch(showSuccessNotification(text));
    }

    onError(error) {
        if(error.status === 409) {
            this.$ngRedux.dispatch(showErrorNotification('Can not delete. Feed has subscriptions'));
        } else if (error.status === 400) {
            this.validations = error.data.fieldErrors;
        } else {
            this.$ngRedux.dispatch(showErrorNotification(error));
        }
    }
}

export const FeedComponent = {
    template, controller
};
