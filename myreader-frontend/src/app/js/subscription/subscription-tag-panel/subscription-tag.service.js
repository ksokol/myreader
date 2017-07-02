'use strict';

require('angular').module('myreader').service('subscriptionTagService', ['$http', function($http) {
    var url = '/myreader/api/2/subscriptions/availableTags';

    return {
        findAll: function() {
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
}]);
