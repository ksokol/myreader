angular.module('common.filters', ['ngSanitize'])

.filter('targetBlank', ['$sanitize', function($sanitize) {
    var A_TAG_REGEXP = /<a[^>]*>[\s\S]*?<\/a>/i;
    var TARGET_REGEXP = /target="(.*)"/i;

    return function(text, target) {
        if (!text) {
            return text;
        }
        var match;
        var raw = text;
        var html = [];
        var aTag;
        var i;
        while ((match = raw.match(A_TAG_REGEXP))) {
            aTag = match[0];
            if(aTag.contains("href")) {
                addBlankTarget(aTag);
            }
            i = match.index;
            addText(raw.substr(0, i));
            raw = raw.substring(i + match[0].length);
        }
        addText(raw);
        return $sanitize(text);

        function addText(text) {
            if (!text) {
                return;
            }
            html.push($sanitize(text));
        }

        function addBlankTarget(text) {
            var match;
            if((match = text.match(TARGET_REGEXP) )) {
                if(match[1] === '_blank') {
                    html.push(text);
                } else {
                    //TODO
                    return text;
                }
            }
            html.push(text.substr(0, 2) + ' target="_blank" ' + text.substr(3));
        }
    };
}]);
