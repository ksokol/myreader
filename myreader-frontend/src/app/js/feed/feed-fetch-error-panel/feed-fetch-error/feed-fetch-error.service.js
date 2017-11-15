import {CONTEXT, FEEDS} from "../../../constants";

export class FetchErrors {

    constructor(errors) {
        this.errors = errors;
        this.fetchError = errors.content;
        this.totalElements = errors.page.totalElements;
        this.retainDays = this.fetchError.length > 0 ? this.fetchError[0].retainDays : 0;
    }

    getLink(rel) {
        return this.errors.links
            .filter(link => link.rel === rel)
            .map(link => link.href)[0];
    };

    next() {
        return this.getLink('next');
    };
}

export class FeedFetchErrorService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    findByFeedId(feedUuid) {
        return this.$http.get(`${FEEDS}/${feedUuid}/fetchError`).then(function (response) {
            return new FetchErrors(response.data);
        });
    }

    findByLink(url) {
        return this.$http.get(CONTEXT + url).then(function (response) {
            return new FetchErrors(response.data);
        });
    }
}
