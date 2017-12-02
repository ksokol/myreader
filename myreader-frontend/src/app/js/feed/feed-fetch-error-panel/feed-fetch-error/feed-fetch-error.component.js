import template from './feed-fetch-error.component.html';
import './feed-fetch-error.component.css';

class controller {

    constructor(feedFetchErrorService) {
        'ngInject';
        this.feedFetchErrorService = feedFetchErrorService;
        this.errors = [];
    }

    $onChanges(obj) {
        if (obj.myId.currentValue !== this.id) {
            this.id = obj.myId.currentValue;
            this.loading = true;

            this.feedFetchErrorService.findByFeedId(this.id).then(errors => {
                this.next = errors.next();
                this.totalElements = errors.totalElements;
                this.retainDays = errors.retainDays;
                this.errors = errors.fetchError;
            }).catch(error => this.myOnError({error}))
              .finally(() => this.loading = false);
        }
    }

    onMore(load) {
        this.feedFetchErrorService.findByLink(load).then(errors => {
            this.next = errors.next();
            this.errors = this.errors.concat(errors.fetchError);
        }).catch(error => this.myOnError({error}));
    }

    hasErrors() {
        return this.errors.length > 0;
    }
}

export const FeedFetchErrorComponent = {
    template, controller,
    bindings: {
        myId: '<',
        myOnError: '&'
    }
};
