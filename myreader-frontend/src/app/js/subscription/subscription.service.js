import {SUBSCRIPTIONS} from "../constants";

export class SubscriptionService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    findAll() {
        return this.$http.get(SUBSCRIPTIONS).then(response => response.data.content);
    }

    find(uuid) {
        return this.$http.get(`${SUBSCRIPTIONS}/${uuid}`).then(response => response.data);
    }

    save(subscription) {
        subscription.tag = subscription.tag === "" ? null : subscription.tag;

        return subscription.uuid ?
            this.$http.patch(`${SUBSCRIPTIONS}/${subscription.uuid}`, subscription).then(response => response.data) :
            this.$http.post(SUBSCRIPTIONS, subscription).then(response => response.data);
    }

    remove(uuid) {
        return this.$http.delete(`${SUBSCRIPTIONS}/${uuid}`);
    }
}
