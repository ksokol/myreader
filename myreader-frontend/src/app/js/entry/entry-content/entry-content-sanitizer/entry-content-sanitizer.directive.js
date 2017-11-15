export const EntryContentSanitizerDirective = ($timeout, safeOpenerService) => {
    'ngInject';
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
};
