export const ScrollIntoViewDirective = () => {
    return {
        restrict: 'A',
        link: ($scope, $element, $attrs) => {
            $scope.$watch($attrs.myScrollIntoView, shouldScroll => {
                if (shouldScroll) {
                    $element[0].focus();
                    $element[0].scrollIntoView({block: 'start', behavior: 'smooth'});
                }
            });
        }
    }
};
