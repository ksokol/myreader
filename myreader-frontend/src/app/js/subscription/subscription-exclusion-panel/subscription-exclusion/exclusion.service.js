'use strict';

require('angular').module('myreader').service('exclusionService', ['$http', function($http) {
    var url = '/myreader/api/2/exclusions';

    var extractNextHref = function (links) {
        return links.filter(function (link) { return link.rel === 'next'; })[0];
    };

    var findBy = function (next) {
        return $http.get('/myreader' + next.href)
            .then(function (response) {
                return response;
            });
    };

    return {
        find: function(uuid) {
            return findBy({ href: '/api/2/exclusions/' + uuid + '/pattern'})
                .then(function collect(response) {
                    var next = extractNextHref(response.data.links);

                    if(!next) {
                        return response.data.content;
                    }

                    return findBy(next)
                        .then(collect)
                        .then(function (inner) {
                            return response.data.content.concat(inner);
                        });
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
