(function () {
    'use strict';

    require('angular').module('myreader').service('exclusionService', ['$http', function($http) {
        var url = '/myreader/api/2/exclusions';

        return {
            find: function(uuid) {
                return $http.get(url + '/' + uuid + '/pattern')
                    .then(function (response) {
                        return response.data.content;
                    });
            },
            save: function(uuid, exclusion) {
                return $http.post(url + '/' + uuid + '/pattern', { pattern: exclusion })
                    .then(function (response) {
                        return response.data;
                    });
            },
            delete: function(subscriptionUuid, uuid) {
                return $http.delete(url + '/' + subscriptionUuid + '/pattern/' + uuid);
            }
        }
    }]);

    module.exports = 'myreader.exclusion.service';

})();
