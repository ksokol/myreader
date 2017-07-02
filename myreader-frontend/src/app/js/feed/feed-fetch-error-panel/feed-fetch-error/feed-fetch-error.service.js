'use strict';

var FetchErrors = function(errors) {
    var self = this;
    self.fetchError = errors.content;
    self.totalElements = errors.page.totalElements;
    self.retainDays = self.fetchError.length > 0 ? self.fetchError[0].retainDays : 0;

    var getLink = function(rel) {
        return errors.links.filter(function (link) {
            return link.rel === rel;
        }).map(function (link) {
            return link.href;
        })[0];
    };

    self.next = function() {
        return getLink('next');
    };
};

require('angular').module('myreader').service('feedFetchErrorService', ['$http', function($http) {
    var feedUrl = '/myreader/api/2/feeds';

    return {
        findByFeedId: function(feedUuid) {
            return $http.get(feedUrl + '/' + feedUuid + '/fetchError').then(function (response) {
                return new FetchErrors(response.data);
            });
        },
        findByLink: function(url) {
            return $http.get('/myreader' + url).then(function (response) {
                return new FetchErrors(response.data);
            });
        }
    }
}]);
