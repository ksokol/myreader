(function () {
    'use strict';

    var timeago = require('timeago.js');

    require('angular').module('myreader').filter('timeago', function() {

        return function(date) {
            if(date) {
                try {
                    return timeago().format(date);
                } catch(e) {}
            }
            return "sometime";
        }
    });

})();
