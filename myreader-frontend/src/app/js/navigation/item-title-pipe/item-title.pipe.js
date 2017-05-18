(function () {
    'use strict';

    require('angular').module('myreader').filter('myNavigationItemTitle', function () {
        return function(item) {
            if(!item) {
                return '';
            }
            var unseen = item.unseen;
            var title = item.title || '';
            var countStr = '';

            if(unseen && unseen > 0) {
                countStr += " (" + unseen + ")";
            }

            if (title.length >= 32 && countStr.length > 0) {
                title = title.substr(0, 29) + '...';
            } else if (title.length >= 32) {
                title = title.substr(0, 32) + '...';
            }

            return title + countStr;
        }
    });

    module.exports = 'myreader.navigation.item-title.pipe';

})();
