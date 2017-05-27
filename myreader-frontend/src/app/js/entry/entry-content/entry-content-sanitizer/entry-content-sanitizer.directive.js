(function () {
    'use strict';

    require('../../../shared/safe-opener/safe-opener.service');

    require('angular')
        .module('myreader')
        .directive('myEntryContentSanitizer', ['$timeout', 'safeOpenerService', function ($timeout, safeOpenerService) {

            return {
                restrict: 'A',
                link: function(scope, element) {
                    $timeout(function () {
                        element.find('a').on('click', function ($event) {
                            $event.preventDefault();
                            safeOpenerService.openSafely(this.href);
                        })
                    }, 0);
                }
            }
        }]);

    module.exports = 'myreader.entry-content-sanitizer.directive';

})();
