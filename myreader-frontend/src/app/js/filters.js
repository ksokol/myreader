var angular = require('angular');
var angularSanitize = require('angular-sanitize');
var moment = require('moment');

angular.module('common.filters', ['ngSanitize'])

.filter('targetBlank', ['$sanitize', function($sanitize) {
    var A_TAG_REGEXP = /<a[^>]*>[\s\S]*?<\/a>/i;
    var TARGET_REGEXP = /target="([a-zA-Z_#]{1,})"/i;

    var addBlankTarget = function(text) {
        var match;
        if((match = text.match(TARGET_REGEXP) )) {
            if(match[1] === '_blank') {
                return text;
            }
        }
        return text.substr(0, 2) + ' target="_blank" ' + text.substr(3);
    };

    return function(text) {
        if (!text) {
            return '';
        }
        var match,
            raw = text;

        var matches = [],
            i = 0;

        while ((match = raw.match(A_TAG_REGEXP))) {
            matches.push(match[0]);
            i = match.index;
            raw = raw.substring(i + match[0].length);
        }

        for(var j=0;j<matches.length;j++) {
            var regexMatch = matches[j];
            if(regexMatch.indexOf("href") > -1) {
                var blank = addBlankTarget(regexMatch);
                text = text.replace(regexMatch, blank);
            }
        }

        return $sanitize(text);
    };
}])

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
