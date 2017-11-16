export const EntryContentSanitizerDirective = $timeout => {
    'ngInject';
    return {
        restrict: 'A',
        link: (scope, element) =>
            $timeout(() => element.find('a').on('click', function () {
                this.rel = 'noopener noreferrer';
                this.target = '_blank'
            }), 0)
    }
};
