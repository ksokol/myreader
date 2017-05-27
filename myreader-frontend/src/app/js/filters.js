var angular = require('angular');
var moment = require('moment');

angular.module('common.filters', [])

.filter('timeago', function() {

    return function(date) {
        if(date) {
            try {
                return moment(date).fromNow();
            } catch(e) {}
        }
        return "sometime";
    }
});

module.exports = 'filters';
