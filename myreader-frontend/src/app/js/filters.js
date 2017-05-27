var angular = require('angular');
var timeago = require('timeago.js');

angular.module('common.filters', [])

.filter('timeago', function() {

    return function(date) {
        if(date) {
            try {
                return timeago().format(date);
            } catch(e) {}
        }
        return "sometime";
    }
});

module.exports = 'filters';
