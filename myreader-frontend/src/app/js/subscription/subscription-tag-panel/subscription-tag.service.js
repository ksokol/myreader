import {SUBSCRIPTION_AVAILABLE_TAGS} from "../../constants"

export class SubscriptionTagService {

    constructor($http) {
        'ngInject'
        this.$http = $http
    }

    findAll() {
        return this.$http.get(SUBSCRIPTION_AVAILABLE_TAGS).then(response => response.data)
    }
}
