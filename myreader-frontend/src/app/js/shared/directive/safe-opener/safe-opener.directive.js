(function () {
    'use strict';

    require('angular').module('myreader').directive('mySafeOpener', ['$window', function ($window) {
        return {
            restrict: 'A',
            scope: {
                url: '@'
            },
            link: function(scope, element) {
                element.on('click', function () {
                    var otherWindow = $window.open();
                    otherWindow.opener = null;
                    otherWindow.location = scope.url;
                });
            }
        }
    }]);

    module.exports = 'myreader.safe-opener.directive';

})();
