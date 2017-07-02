'use strict';

var About = function (about) {
    var self = this;

    self.branch = about.git.branch;
    self.commitId = about.git.commit.id;
    self.version = about.build.version;
    self.buildTime = about.build.time;
};

require('angular').module('myreader').service('aboutService', ['$http', function($http) {
    var url = '/myreader/info';

    return {
        getProperties: function() {
            return $http.get(url).then(function (response) {
                return new About(response.data);
            });
        }
    }
}]);
