import {SUBSCRIPTIONS} from '../constants'

export class SubscriptionService {

    constructor($http) {
        'ngInject'
        this.$http = $http
    }

    find(uuid) {
        return this.$http.get(`${SUBSCRIPTIONS}/${uuid}`).then(response => response.data)
    }
}
