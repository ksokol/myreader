const feedUrl = '/myreader/api/2/feeds';

export class FeedService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    findAll() {
        return this.$http.get(feedUrl).then(response => response.data.content);
    }

    findOne(uuid) {
        return this.$http.get(`${feedUrl}/${uuid}`).then(response => response.data);
    }

    remove(feed) {
        return this.$http.delete(`${feedUrl}/${feed.uuid}`);
    }

    save(feed) {
        return this.$http.patch(`${feedUrl}/${feed.uuid}`, {title: feed.title, url: feed.url }).then(response => response.data);
    }
}
