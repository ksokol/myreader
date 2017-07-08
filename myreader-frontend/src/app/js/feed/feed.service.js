'use strict';

function FeedService($http) {

    var feedUrl = '/myreader/api/2/feeds';

    return {
        findAll: function() {
            return $http.get(feedUrl)
                .then(function (response) {
                    return response.data.content;
                });
        },
        findOne: function(uuid) {
            return $http.get(feedUrl + '/' + uuid)
                .then(function (response) {
                    return response.data;
                });
        },
        remove: function(feed) {
            return $http.delete(feedUrl + '/' + feed.uuid);
        },
        save: function(feed) {
            return $http.patch(feedUrl + '/' + feed.uuid, { 'title': feed.title, 'url': feed.url })
                .then(function (response) {
                    return response.data;
                });
        }
    }
}

require('angular').module('myreader').service('feedService', ['$http', FeedService]);
