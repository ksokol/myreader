import {AVAILABLE_TAGS} from "../../constants";

export class SubscriptionTagService {

    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    findAll() {
        return this.$http.get(AVAILABLE_TAGS).then(response => response.data);
    }
}
