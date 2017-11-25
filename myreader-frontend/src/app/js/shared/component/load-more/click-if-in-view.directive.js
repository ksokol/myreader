export const ClickIfInViewDirective = ($timeout) => {
    'ngInject';
    return {
        restrict: 'A',
        link: ($scope, $element) => {
            const handler = entries => {
                if (entries[0].isIntersecting) {
                    $element[0].click();
                }
            };

            const observer = new IntersectionObserver(handler, {threshold: 0.01});
            $timeout(() => observer.observe($element[0]), 100);
            $scope.$on('$destroy', () => observer.disconnect());
        }
    }
};
