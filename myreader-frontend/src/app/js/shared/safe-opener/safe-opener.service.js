(function () {
    'use strict';

    require('angular').module('myreader').service('safeOpenerService', ['$window', function ($window) {
        return {
            openSafely: function(url) {
                var otherWindow = $window.open();
                otherWindow.opener = null;
                otherWindow.location = url;
            }
        }
    }]);

})();
