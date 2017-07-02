'use strict';

require('angular').module('myreader').service('processingService', ['$http', function($http) {
    var url = '/myreader/api/2/processing';

    return {
        rebuildSearchIndex: function() {
            return $http.put(url, { process: 'indexSyncJob' });
        }
    }
}]);
