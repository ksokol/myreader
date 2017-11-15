const url = '/myreader/api/2/subscriptions';

export class SubscriptionService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    findAll() {
        return this.$http.get(url).then(response => response.data.content);
    }

    find(uuid) {
        return this.$http.get(`${url}/${uuid}`).then(response => response.data);
    }

    save(subscription) {
        subscription.tag = subscription.tag === "" ? null : subscription.tag;

        return subscription.uuid ?
            this.$http.patch(`${url}/${subscription.uuid}`, subscription).then(response => response.data) :
            this.$http.post(url, subscription).then(response => response.data);
    }

    remove(uuid) {
        return this.$http.delete(`${url}/${uuid}`);
    }
}
