import {FEEDS} from "../constants";

export class FeedService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    findAll() {
        return this.$http.get(FEEDS).then(response => response.data.content);
    }

    findOne(uuid) {
        return this.$http.get(`${FEEDS}/${uuid}`).then(response => response.data);
    }

    remove(feed) {
        return this.$http.delete(`${FEEDS}/${feed.uuid}`);
    }

    save(feed) {
        return this.$http.patch(`${FEEDS}/${feed.uuid}`, {title: feed.title, url: feed.url}).then(response => response.data);
    }
}
