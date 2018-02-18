import {FEEDS} from "../constants";

export class FeedService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    findAll() {
        return this.$http.get(FEEDS).then(response => response.data.content);
    }

    remove(feed) {
        return this.$http.delete(`${FEEDS}/${feed.uuid}`);
    }
}
