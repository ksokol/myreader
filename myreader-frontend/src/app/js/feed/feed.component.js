import template from './feed.component.html';
import './feed.component.css';

class controller {

    constructor($state, $stateParams, feedService) {
        'ngInject';
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.feedService = feedService;
    }

    $onInit() {
        this.feedService.findOne(this.$stateParams.uuid)
            .then(data => this.feed = data)
            .catch(error => this.message = {type: 'error', message: error});
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

    onSuccessSave() {
        this.message = {type: 'success', message: 'saved'};
    }

    onError(error) {
        if(error.status === 409) {
            this.message = {type: 'error', message: 'abort. Feed has subscriptions'};
        } else if (error.status === 400) {
            this.validations = error.data.fieldErrors;
        } else {
            this.message = {type: 'error', message: error.data};
        }
    }
}

export const FeedComponent = {
    template, controller
};
