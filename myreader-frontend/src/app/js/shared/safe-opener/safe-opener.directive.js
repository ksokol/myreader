'use strict';

require('./safe-opener.service');

require('angular').module('myreader').directive('mySafeOpener', ['safeOpenerService', function (safeOpenerService) {
    return {
        restrict: 'A',
        controllerAs: 'ctrl',
        bindToController: {
            url: '@'
        },
        controller: function () {},
        link: function(scope, element, attrs) {
            element.on('click', function () {
                safeOpenerService.openSafely(attrs.url);
            });
        }
    }
}]);
