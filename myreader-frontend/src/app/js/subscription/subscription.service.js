(function () {
    'use strict';

    require('angular').module('myreader').service('subscriptionService', ['$http', function($http) {
        var url = '/myreader/api/2/subscriptions';

        return {
            findAll: function() {
                return $http.get(url)
                    .then(function (response) {
                        return response.data.content;
                    });
            },
            find: function(uuid) {
                return $http.get(url + '/' + uuid)
                    .then(function (response) {
                        return response.data;
                    });
            },
            save: function(subscription) {
                subscription.tag = subscription.tag === "" ? null : subscription.tag;

                if(subscription.uuid) {
                    return $http.patch(url + '/' + subscription.uuid, subscription)
                        .then(function (response) {
                            return response.data;
                        });
                }

                return $http.post(url, subscription)
                    .then(function (response) {
                        return response.data;
                    });
            },
            unsubscribe: function(subscription) {
                return $http.delete(url + '/' + subscription.uuid);
            }
        }
    }]);

    module.exports = 'myreader.subscription.service';

})();
