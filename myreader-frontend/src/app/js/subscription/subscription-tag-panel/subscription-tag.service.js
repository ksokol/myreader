const url = '/myreader/api/2/subscriptions/availableTags';

export class SubscriptionTagService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    findAll() {
        return this.$http.get(url).then(response => response.data);
    }
}
