export const SafeOpenerDirective = (safeOpenerService) => {
    'ngInject';
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
};
