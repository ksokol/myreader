import angular from 'angular';
import {Bookmarks} from './models';

angular.module('common.services', [])

.service('bookmarkService', ['$http', function($http) {
    var url = '/myreader/api/2/subscriptionEntries/availableTags';

    return {
        findAll: function() {
            return $http.get(url)
                .then(function (response) {
                    return new Bookmarks(response.data);
                });
        }
    }
}]);
