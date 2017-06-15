(function () {
    'use strict';

    require('./safe-opener.service');

    require('angular').module('myreader').directive('mySafeOpener', ['safeOpenerService', function (safeOpenerService) {
        return {
            restrict: 'A',
            scope: {
                url: '@'
            },
            link: function(scope, element) {
                element.on('click', function () {
                    safeOpenerService.openSafely(scope.url);
                });
            }
        }
    }]);

})();
